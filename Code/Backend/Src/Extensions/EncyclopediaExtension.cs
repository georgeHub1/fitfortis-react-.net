using Backend.Configuration;
using Backend.Entities;

namespace Backend.Extensions
{
    public static class EncyclopediaExtension
    {
        public static string GetTitle(this EncyclopediaEntity entity, string languageCode)
        {
            if (entity == null )
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.TitleEn ?? string.Empty;
                case Constants.Usa:
                    return entity.TitleEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.TitleBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.TitleUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetDescription(this EncyclopediaEntity entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.DescriptionEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.DescriptionEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.DescriptionBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.DescriptionUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetTitle(this Drug entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.TitleEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.TitleEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.TitleBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.TitleUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetDescription(this Drug entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.DescriptionEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.DescriptionEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.DescriptionBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.DescriptionUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetUnit(this Metric entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.UnitEn ?? string.Empty;
                case Constants.Usa:
                    return entity.UnitEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.UnitBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.UnitUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetTitle(this News entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.TitleEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.TitleEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.TitleBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.TitleUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetDescription(this News entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.DescriptionEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.DescriptionEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.DescriptionBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.DescriptionUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetMessage(this Alert entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.MessageEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.MessageEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.MessageBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.MessageUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetConvertionalValue(this Metric entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.UnitEnConversionToSi ?? string.Empty;
                case Constants.Usa:
                    return entity.UnitEnUsConversionToSi ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.UnitBgBgConversionToSi ?? string.Empty;
                case Constants.Ukraine:
                    return entity.UnitUkUaConversionToSi ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetCategory(this Analytic entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.CategoryEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.CategoryEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.CategoryBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.CategoryUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }
        public static string GetName(this Analytic entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return  entity.NameEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.NameEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.NameBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.NameUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetFrequency(this ControlCheckup entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.FrequencyEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.FrequencyEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.FrequencyBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.FrequencyUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }

        public static string GetCheckup(this ControlCheckup entity, string languageCode)
        {
            if (entity == null)
            {
                return string.Empty;
            }

            switch (languageCode.ToLowerInvariant())
            {
                case Constants.International:
                    return entity.ProfilacticCheckupEn ?? string.Empty; ;
                case Constants.Usa:
                    return entity.ProfilacticCheckupEnUs ?? string.Empty;
                case Constants.Bulgaria:
                    return entity.ProfilacticCheckupBgBg ?? string.Empty;
                case Constants.Ukraine:
                    return entity.ProfilacticCheckupUkUa ?? string.Empty;
                default:
                    return string.Empty;

            }
        }
    }
}
