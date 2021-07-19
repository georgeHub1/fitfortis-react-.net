using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public class ServiceUser : BaseService, IServiceUser
    {
        private readonly IRepositoryUser _userRepository;
        private readonly IRepositoryEncyclopediaEntity _repositoryEncyclopediaEntity;
        private readonly IRepositoryUserLoginStats _repositoryUserLoginStats;
        private readonly IRepositoryControlCheckup _repositoryControlCheckup;

        public ServiceUser(IRepositoryUser userRepository, IRepositoryEncyclopediaEntity repositoryEncyclopediaEntity, IRepositoryUserLoginStats repositoryUserLoginStats,
            IRepositoryControlCheckup repositoryControlCheckup)
        {
            _userRepository = userRepository;
            _repositoryEncyclopediaEntity = repositoryEncyclopediaEntity;
            _repositoryUserLoginStats = repositoryUserLoginStats;
            _repositoryControlCheckup = repositoryControlCheckup;
        }

        public async Task<ServiceResponse<User>> GetAllUsers(IServiceRequest request)
        {
            return await ExecuteAsync(() =>
            {
                var data = _userRepository.SelectAll();

                var totalCount = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<User>(pagedData.ToList(), totalCount);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> GetUserById(IServiceRequest request, Guid id, bool throwNotFound = true)
        {
            return await ExecuteAsync(() =>
            {
                var data = _userRepository.SelectById(id, throwNotFound);

                return new ServiceResponse<User>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticUserSigninDetails>> GetUserSigninDetails(IServiceRequest request, MetricDataQueryParams queryParams)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryUserLoginStats.SelectAll().Select(it => new AnalyticUserSigninDetails
                {
                    AnonymousId = it.AnonymousId,
                    SessionDurationInSeconds = it.SessionDurationInSeconds,
                    SignInDatetime = it.SignInDatetime,
                    UserId = it.UserId,
                    Browser = UserAgentParser.GetBrowser(it.UserAgent),
                    Os = UserAgentParser.GetOs(it.UserAgent),
                    Device = UserAgentParser.GetDevice(it.UserAgent),
                    RequestUa = it.UserAgent
                });

                if (queryParams.UserId.HasValue)
                {
                    data = data.Where(it => it.UserId == queryParams.UserId);
                }

                if (queryParams.DateFrom.HasValue)
                {
                    data = data.Where(it => it.SignInDatetime >= queryParams.DateFrom);
                }

                if (queryParams.DateTo.HasValue)
                {
                    data = data.Where(it => it.SignInDatetime <= queryParams.DateTo);
                }

                var totalCount = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<AnalyticUserSigninDetails>(pagedData.ToList(), totalCount);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> UpdateUser(IServiceRequest request, Guid id, UpdateUser data)
        {
            return await ExecuteAsync(() =>
            {
                var user = _userRepository.SelectById(id);

                _userRepository.Update(MapUser(user, data));

                _userRepository.Save();

                return new ServiceResponse<User>(user);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> UpdateUserBasicInformation(IServiceRequest request, Guid id, UpdateBasicInformation data)
        {
            return await ExecuteAsync(() =>
            {
                var localUser = _userRepository.SelectById(id);

                localUser.SexAtBirth = data.SexAtBirth;
                localUser.EthnicOrigin = data.EthnicOrigin;
                localUser.GenderIdentity = data.GenderIdentity;
                localUser.BloodGroup = data.BloodGroup;
                localUser.RhFactor = data.RhFactor;
                localUser.Pregnancy = localUser.SexAtBirth.HasValue && localUser.SexAtBirth == SexAtBirthType.Female ? data.Pregnancy : null;

                _userRepository.Update(localUser);

                _userRepository.Save();

                return new ServiceResponse<User>(localUser);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> UpdateUserLifestyle(IServiceRequest request, Guid id, UpdateLifestyle data)
        {
            return await ExecuteAsync(() =>
            {
                var localUser = _userRepository.SelectById(id);

                localUser.Diet = data.Diet;
                localUser.Sports = data.Sports;
                localUser.Alcohol = data.Alcohol;
                localUser.TobaccoConsumption = data.Tobacco;
                localUser.SexuallyActive = data.SexuallyActive;
                localUser.HighPromiscuity = data.HighPromiscuity;

                _userRepository.Update(localUser);
                _userRepository.Save();

                return new ServiceResponse<User>(localUser);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> DeleteUser(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _userRepository.Delete(id);

                _userRepository.Save();

                return new ServiceResponse<User>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> UpdateAvatarId(IServiceRequest request, Guid userId, Guid avatarId)
        {
            return await ExecuteAsync(() =>
            {
                var localUser = _userRepository.SelectById(userId);

                localUser.AvatarId = avatarId;

                _userRepository.Update(localUser);

                _userRepository.Save();

                return new ServiceResponse<User>(localUser);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<User>> UpdateConfirmationDate(IServiceRequest request, Guid userId, DateTime accountConfirmationDate)
        {
            return await ExecuteAsync(() =>
            {
                var localUser = _userRepository.SelectById(userId);

                localUser.EmailConfirmedDate = accountConfirmationDate;

                _userRepository.Update(localUser);

                _userRepository.Save();

                return new ServiceResponse<User>(localUser);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticUserSignIn>> AddLoginToStat(IServiceRequest request, AnalyticUserSignIn loginStats)
        {
            return await ExecuteAsync(() =>
            {
                var newAntalytic = new AnalyticUserSignIn();
                if (!loginStats.UserId.HasValue)
                {
                    newAntalytic.SignInDatetime = DateTime.UtcNow;
                    newAntalytic.Status = LoginStatus.Successful;
                }
                else
                {
                    newAntalytic = loginStats;
                }


                var entity = _repositoryUserLoginStats.Create(newAntalytic);
                _repositoryUserLoginStats.Save();

                return new ServiceResponse<AnalyticUserSignIn>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticUserSignIn>> SetUserSessionDuration(IServiceRequest request, AnalyticUserSignIn loginStats)
        {
            return await ExecuteAsync(() =>
            {
                var localStat = _repositoryUserLoginStats.SelectAll().LastOrDefault(it => it.UserId == loginStats.UserId);
                
                if (localStat != null)
                {
                    localStat.SessionDurationInSeconds = loginStats.SessionDurationInSeconds;

                    _repositoryUserLoginStats.Update(localStat);
                    _repositoryUserLoginStats.Save();
                }

                return new ServiceResponse<AnalyticUserSignIn>(localStat);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ProfileCommonResult>> GetBasicInformationForUser(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var user = _userRepository.SelectById(userId);

                var data = ParseBasicInformation(user, language);

                return new ServiceResponse<ProfileCommonResult>(data, data.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ProfileCommonResult>> GetLifestyleInformationForUser(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var user = _userRepository.SelectById(userId);

                var data = ParseLifestyle(user, language);

                return new ServiceResponse<ProfileCommonResult>(data, data.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<HealthIndexDetails>> GetUserHealthIndex(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                List<float> total = new List<float>();
               
                HealthIndexDetails result = new HealthIndexDetails{HealthIndex = null};
                var user = _userRepository.SelectById(userId);


                total.Add(user.TobaccoConsumption?.GetEnumHealthIndexAmount() ?? 0);
                total.Add(user.Alcohol?.GetEnumHealthIndexAmount() ?? 0);
                total.Add(user.Sports?.GetEnumHealthIndexAmount() ?? 0);

                total.Add(user.UserConditions.Sum(it => it.ChronicCondition.HealthIndexAmount));
                total.Add(user.UserFamilyHistory.Sum(it => it.FamilyHistory.HealthIndexAmount));
                total.Add(user.UserVaccineTherapies.Sum(it => it.VaccineTherapy.HealthIndexAmount));

                if (total.Any(it => !it.Equals(0)))
                {
                    result.HealthIndex = Constants.HealthIndexBaseValue - total.Sum();
                }

                return new ServiceResponse<HealthIndexDetails>(result);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ShortControlCheckup>> GetUserControlCheckups(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var today = DateTime.Today;
                var result = new List<ShortControlCheckup>();
                var user = _userRepository.SelectById(userId);
                var age = 0;

                if (user.DateOfBirth.HasValue)
                {
                    age = today.Year - user.DateOfBirth.Value.Year;
                    if (user.DateOfBirth.Value.Date > today.AddYears(-age))
                    {
                        age--;
                    }
                }

                var checkupsList = _repositoryControlCheckup.SelectAll()
                    .Where(it => (it.Gender == CheckupGender.Both || (int) it.Gender == (int) user.SexAtBirth)
                                 && (age > it.MinAge && it.MaxAge == null || it.MinAge == null && age < it.MaxAge || age > it.MinAge && age < it.MaxAge || it.MinAge == null && it.MaxAge == null));

                foreach (var controlCheckup in checkupsList.ToList())
                {
                    if (!string.IsNullOrEmpty(controlCheckup.FamilyHistory))
                    {
                        var ids = controlCheckup.FamilyHistory.Split(',').Select(it => new Guid(it));

                        if (user.UserFamilyHistory.Any(it => ids.Contains(it.Id)))
                        {
                            result.Add(new ShortControlCheckup{Frequency = controlCheckup.GetFrequency(language), ProfilacticCheckup = controlCheckup.GetCheckup(language)});
                        }
                        continue;
                    }

                    if (!string.IsNullOrEmpty(controlCheckup.ChronicConditions))
                    {
                        var ids = controlCheckup.ChronicConditions.Split(',').Select(it => new Guid(it));

                        if (user.UserConditions.Any(it => ids.Contains(it.Id)))
                        {
                            result.Add(new ShortControlCheckup { Frequency = controlCheckup.GetFrequency(language), ProfilacticCheckup = controlCheckup.GetCheckup(language) });
                        }
                        continue;
                    }

                    if (!string.IsNullOrEmpty(controlCheckup.UserProperty))
                    {
                        var userValue = (int) user.GetType().GetProperty(controlCheckup.UserProperty)?.GetValue(user, null);

                        var ids = controlCheckup.PropertyValues.Split(',').Select(it => Convert.ToInt32(it, CultureInfo.InvariantCulture));

                        if (ids.Contains(userValue))
                        {
                            result.Add(new ShortControlCheckup {Frequency = controlCheckup.GetFrequency(language), ProfilacticCheckup = controlCheckup.GetCheckup(language)});
                        }

                        continue;
                    }

                    result.Add(new ShortControlCheckup { Frequency = controlCheckup.GetFrequency(language), ProfilacticCheckup = controlCheckup.GetCheckup(language) });
                }


                return new ServiceResponse<ShortControlCheckup>(result, result.Count);
            }).ConfigureAwait(false);
        }

        private List<ProfileCommonResult> ParseBasicInformation(User user, string language)
        {
            var result = new List<ProfileCommonResult>();

            var ids = user.SexAtBirth.HasValue && user.SexAtBirth == SexAtBirthType.Female ? Constants.FemaleBasicInformationList : Constants.MaleBasicInformationList;
            var encyclopedia = _repositoryEncyclopediaEntity.SelectAllByIds(ids).ToList();
            var enumDictionary = ParseBasicInfoEnyms(user, language);
            
            foreach (var encyclopediaEntity in encyclopedia)
            {
                result.Add(new ProfileCommonResult
                {
                    Category = ResourceStringExctractor.GetLocalizedString(ProfieCategory.BasicInformation.ToString(), language),
                    Key = encyclopediaEntity.GetTitle(Constants.Usa).Replace(" ", ""),
                    Name = encyclopediaEntity.GetTitle(language),
                    Description = encyclopediaEntity.GetDescription(language),
                    EncyclopediaId = encyclopediaEntity.Id,
                    Values = enumDictionary[encyclopediaEntity.Id]
                });
            }

            return result;
        }

        private List<ProfileCommonResult> ParseLifestyle(User user, string language)
        {
            var result = new List<ProfileCommonResult>();

            var encyclopedia = _repositoryEncyclopediaEntity.SelectAllByIds(Constants.LifestyleList).OrderByDescending(it => it.Id).ToList();
            var enumDictionary = ParseLifestyleEnums(user, language);

            foreach (var encyclopediaEntity in encyclopedia)
            {
                var key = encyclopediaEntity.GetTitle(Constants.Usa).Replace(" ", "");
                result.Add(new ProfileCommonResult
                {
                    Category = ResourceStringExctractor.GetLocalizedString(ProfieCategory.Lifestyle.ToString(), language),
                    Name = encyclopediaEntity.GetTitle(language),
                    Key = key.Contains('(') ? key.Substring(0, key.IndexOf('(')) : key,
                    Description = encyclopediaEntity.GetDescription(language),
                    EncyclopediaId = encyclopediaEntity.Id,
                    Values = enumDictionary[encyclopediaEntity.Id]
                });
            }

            return result;
        }


        private static Dictionary<Guid, List<EnumValuesResult>> ParseLifestyleEnums(User user, string language)
        {
            var result = new Dictionary<Guid, List<EnumValuesResult>>();

            var alcoholList = new List<EnumValuesResult>();

            foreach (Alcohol alcohol in Enum.GetValues(typeof(Alcohol)))
            {
                alcoholList.Add(new EnumValuesResult
                {
                    Name = ResourceStringExctractor.GetLocalizedString(alcohol.ToString(), language),
                    Id = (int) alcohol,
                    IsSelected = alcohol == user.Alcohol,
                    HelthIndexAmount = alcohol.GetEnumHealthIndexAmount()
                });
            }

            result.Add(Constants.Alcohol, alcoholList);


            var dietList = new List<EnumValuesResult>();

            foreach (Diet diet in Enum.GetValues(typeof(Diet)))
            {
                dietList.Add(new EnumValuesResult
                {
                    Name = ResourceStringExctractor.GetLocalizedString(diet.ToString(), language),
                    Id = (int) diet,
                    IsSelected = diet == user.Diet
                });
            }

            result.Add(Constants.Diet, dietList);


            var sportList = new List<EnumValuesResult>();

            foreach (Sport sport in Enum.GetValues(typeof(Sport)))
            {
                sportList.Add(new EnumValuesResult
                {
                    Name = ResourceStringExctractor.GetLocalizedString(sport.ToString(), language),
                    Id = (int) sport,
                    IsSelected = sport == user.Sports,
                    HelthIndexAmount = sport.GetEnumHealthIndexAmount()
                });
            }

            result.Add(Constants.Sport, sportList);


            var tobaccoList = new List<EnumValuesResult>();
            foreach (TobaccoConsumption tobacco in Enum.GetValues(typeof(TobaccoConsumption)))
            {
                tobaccoList.Add(new EnumValuesResult
                {
                    Name = ResourceStringExctractor.GetLocalizedString(tobacco.ToString(), language),
                    Id = (int) tobacco,
                    IsSelected = tobacco == user.TobaccoConsumption,
                    HelthIndexAmount = tobacco.GetEnumHealthIndexAmount()
                });
            }

            result.Add(Constants.Tobacco, tobaccoList);

            var sexualActive = new List<EnumValuesResult>();
            foreach (YesNo value in Enum.GetValues(typeof(YesNo)))
            {
                sexualActive.Add(new EnumValuesResult
                {
                    Id = (int) value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.SexuallyActive == value
                });
            }

            result.Add(Constants.SexualActive, sexualActive);

            var highProminscuity = new List<EnumValuesResult>();
            foreach (YesNo value in Enum.GetValues(typeof(YesNo)))
            {
                highProminscuity.Add(new EnumValuesResult
                {
                    Id = (int) value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.HighPromiscuity == value
                });
            }

            result.Add(Constants.HighProminscuity, highProminscuity);

            return result;

        }

        private static Dictionary<Guid, List<EnumValuesResult>> ParseBasicInfoEnyms(User user, string language)
        {
            var result = new Dictionary<Guid, List<EnumValuesResult>>();

            var sex = new List<EnumValuesResult>();

            foreach (SexAtBirthType value in Enum.GetValues(typeof(SexAtBirthType)))
            {
                sex.Add(new EnumValuesResult
                {
                    Id = (int) value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.SexAtBirth == value
                });
            }

            result.Add(Constants.SexAtBirth, sex);


            var gender = new List<EnumValuesResult>();
            foreach (GenderType value in Enum.GetValues(typeof(GenderType)))
            {
                gender.Add(new EnumValuesResult
                {
                    Id = (int)value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.GenderIdentity == value
                });
            }

            result.Add(Constants.GenderIdentity, gender);

            var ethnic = new List<EnumValuesResult>();
            foreach (EthnicOriginType value in Enum.GetValues(typeof(EthnicOriginType)))
            {
                ethnic.Add(new EnumValuesResult
                {
                    Id = (int)value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.EthnicOrigin == value
                });
            }

            result.Add(Constants.EthnicOrigin, ethnic);

            var bloodGroup = new List<EnumValuesResult>();
            foreach (BloodGroupType value in Enum.GetValues(typeof(BloodGroupType)))
            {
                bloodGroup.Add(new EnumValuesResult
                {
                    Id = (int)value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString()),
                    IsSelected = user.BloodGroup == value
                });
            }

            result.Add(Constants.BloodGroup, bloodGroup);

            var rhFactor = new List<EnumValuesResult>();
            foreach (RhType value in Enum.GetValues(typeof(RhType)))
            {
                rhFactor.Add(new EnumValuesResult
                {
                    Id = (int)value,
                    Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                    IsSelected = user.RhFactor == value
                });
            }

            result.Add(Constants.RhFactor, rhFactor);

            if (user.SexAtBirth.HasValue && user.SexAtBirth == SexAtBirthType.Female)
            {
                var pregnancy = new List<EnumValuesResult>();
                foreach (YesNo value in Enum.GetValues(typeof(YesNo)))
                {
                    pregnancy.Add(new EnumValuesResult
                    {
                        Id = (int) value,
                        Name = ResourceStringExctractor.GetLocalizedString(value.ToString(), language),
                        IsSelected = user.Pregnancy == value
                    });
                }

                result.Add(Constants.Pregnancy, pregnancy);
            }

            return result;

        }


        private User MapUser(User user, UpdateUser data)
        {
            user.FirstName = data.FirstName;
            user.LastName = data.LastName;
            user.DateOfBirth = data.DateOfBirth;
            user.Language = data.Language;

            user.BiologicalChildren = data.BiologicalChildren;
            user.NonBiologicalChildren = data.NonBiologicalChildren;

            user.PregnantDueDate = data.PregnantDueDate;
            user.FirstPregnancyDate = data.FirstPregnancyDate;
            user.LastPregnancy = data.LastPregnancy;

            return user;
        }
    }
}
