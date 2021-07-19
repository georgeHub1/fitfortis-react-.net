using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BenchmarkDotNet.Attributes;

namespace Benchmark
{
    [SimpleJob(warmupCount:5, targetCount:10), MinColumn, MaxColumn]
    public class ResponseBenchmarks
    {
        private HttpClient client;
        private string host = "https://fitfortis-be.azurewebsites.net/api/1.0";

        [GlobalSetup]
        public void GlobalSetup()
        {
            client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXQuZm9ydGlzQG91dGxvb2suY29tIiwianRpIjoiYjY4MTFlMGEtNTBjYi00YzEzLThmMWMtYWZkY2IwMDQ4ODM0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI0YTA3ZWRmMC04YjdmLTRhMmYtYTk2Ni0wOGQ3YjA4ZmU5OTgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTU5OTg4ODU4NywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.Wl5nl11sZ7O1PjXenGdfAa0u2JpD0jcTIq7uX54ge4A");
        }

        #region Encyclopedia

        [Benchmark]
        public Task GetEncyclopedia()
        {
            var url = new Uri(host + "/encyclopedia/search/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region Medicines

        [Benchmark]
        public Task GetMedicines()
        {
            var url = new Uri(host + "/encyclopediamedicine/search/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion


        #region Analytic

        [Benchmark]
        public Task GetAllAnalytics()
        {
            var url = new Uri(host + "/admintools/analytic/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetDataForOneAnalytic()
        {
            var url = new Uri(host + "/admintools/analytic/00000000-0000-0000-0000-000000000016");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetDataForAllAnalytic()
        {
            var url = new Uri(host + "/admintools/analytic/details/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region AdninTools

        [Benchmark]
        public Task GetRoles()
        {
            var url = new Uri(host + "/admintools/role");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetAdminNews()
        {
            var url = new Uri(host + "/admintools/news");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetAdminNewsRecycleBin()
        {
            var url = new Uri(host + "/admintools/news/recyclebin");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUsersWithAdminRole()
        {
            var url = new Uri(host + "/admintools/role/admin/user");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region Chart

        [Benchmark]
        public Task GetUserChartDetails()
        {
            var url = new Uri(host + "/chart/user/CCEBE7FB-FA56-4226-21BF-08D7C5BEA34C/bulk/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region Metric

        [Benchmark]
        public Task GetAllMetrics()
        {
            var url = new Uri(host + "/metric/search/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetAllMetricDetails()
        {
            var url = new Uri(host + "/metric/details/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region News

        [Benchmark]
        public Task GetAllNewsByLanguage()
        {
            var url = new Uri(host + "/news/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region Profile

        [Benchmark]
        public Task GetMe()
        {
            var url = new Uri(host + "/profile/account/me");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetAllUserActivity()
        {
            var url = new Uri(host + "/profile/activity/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserChronicConditions()
        {
            var url = new Uri(host + "/profile/chroniccondition/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserFamilyHistory()
        {
            var url = new Uri(host + "/profile/familyhistory/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserTherapies()
        {
            var url = new Uri(host + "/profile/therapyandvaccine/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserBasicInformation()
        {
            var url = new Uri(host + "/profile/basicinformation/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserLifestyle()
        {
            var url = new Uri(host + "/profile/lifestyle/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserCheckups()
        {
            var url = new Uri(host + "/profile/controlcheckup/user/4a07edf0-8b7f-4a2f-a966-08d7b08fe998/lang/en-US");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region SymptomChecker

        [Benchmark]
        public Task GetAllSymptoms()
        {
            var url = new Uri(host + "/symptomchecker/search/lang/en-US?applicableToMale=true&applicableToFemale=true&applicableToFemalePregnant=true&minAgeOfApplicability=0&maxAgeOfApplicability=1000");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion

        #region Users

        [Benchmark]
        public Task GetAllUsers()
        {
            var url = new Uri(host + "/user");
            var result = client.GetAsync(url);

            return result;
        }

        [Benchmark]
        public Task GetUserHealthIndex()
        {
            var url = new Uri(host + "/user/41d92a4d-bb33-4d45-d2ad-08d7c59feac1/healthindex");
            var result = client.GetAsync(url);

            return result;
        }

        #endregion
    }
}
