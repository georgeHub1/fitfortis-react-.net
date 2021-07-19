namespace Backend.Utility
{
    public enum ApiOperationType
    {
        Unknown = 0,
        // Analytic
        SetUserSessionDuration,
        SetAnonymousUserLogin,

        // User
        GetUserList,
        GetUserById,
        GetUserActivity,
        GetUserBasicInfo,
        GetUserLifestyle,
        GetUserHealthIndex,
        GetUserControlCheckups,
        UpdateUser,
        DeleteUser,
        DeleteUserAvatar,
        UploadAvatar,
        UpdateBasicInformation,
        UpdateLifestyle,

        // Account
        Login,
        Logout,
        Register,
        RegisterConfirm,
        ForgotUserPassword,
        ResetUserPassword,
        ChangeUserPassword,
        RegisterConfirmResend,
        Me,

        // Admin tools
        CreateRole,
        GetAllRoles,
        GetUserRoles,
        GetRoleUsers,
        DeleteRole,
        AddUserToRole,
        DeleteUserFromRole,
        UploadSystemImage,

        // Metric
        GetAllMetrics,
        GetAllMetricDetails,
        SearchMetrics,
        GetMetricById,
        CreateMetric,
        UpdateMetric,
        DeleteMetric,
        GetMetricSearchHistory,
        AddMetricSearch,
        DeleteMetricSearchById,
        DeleteAllMetricSearchItems,

        // Metric Data
        GetMetricData,
        CreateMetricData,
        UpdateMetricData,
        DeleteMetricData,
        UpsertMetricData,

        //Chart
        GetUserCharts,
        GetUserChartDetails,
        GetChartById,
        CreateChart,
        CreateChartWithMetric,
        UpdateChart,
        DeleteChart,

        // ChartMetric
        GetMetricsForChart,
        CreateChartWithDefaultMetrics,
        UpdateChartMetic,
        DeleteChartMetric,

        // Encyclopedia
        Import,
        SearchEncyclopedia,
        GetAllEncyclopedia,
        GetEncyclopediaById,
        CreateEncyclopedia,
        UpdateEncyclopedia,
        DeleteEncyclopedia,
        GetEncyclopediaSearchHistory,
        AddEncyclopediaSearch,
        DeleteEncyclopediaSearchById,
        DeleteAllEncyclopediaSearchItems,

        // FamilyHistory
        GetUserFamilyHistory,
        AddUserFamilyHistory,
        DeleteUserFamilyHistory,

        // ChronicConditions
        CreateChronicConditions,
        RemoveUserCondition,
        GetUserConditions,

        // Vaccine
        GetTherapiesVaccines,
        DeleteUserVaccine,


        // Therapy
        AddUserTherapy,

        // SymptomChecker
        GetAllSymptomDetails,
        GetSymptomSearchHistory,
        AddSymptomSearch,
        DeleteSymptomSearchById,

        // Document
        GetUserDocuments,
        GetDocumentById,
        UpdateDocument,
        RestoreNews,
        InactivateDocument,
        RemoveDocument,
        UploadDocument,
        DownloadDocument,

        // News
        GetNews,
        GetInactiveNews,
        InactivateNews,
        GetNewsById,
        GetNewsByLink,
        CreateNews,
        UpdateNews,
        DeleteNews,
        LikeNews,
        DeleteLike,
        ShareViaEmail,
        UploadNewsPicture,
        GetNewsSearchHistory,
        AddNewsSearch,
        DeleteNewsSearchById,

        // Alerts
        GetAllAlerts,
        CreateAlert,
        UpdateAlert,
        DeleteAlert,
        GetActiveUserAlerts,
        GetAllUserAlerts,

        // Analytic
        GetAllAnalytic,
        GetAnalyticDetails,
        GetDataForAnalytic,
        GetAllAnalyticDetails,
        CreateAnalytic,
        SetValueForAnalytic,
        UpdateAnalytic,
        DeleteAnalytic,

        //Drugs
        GetAllDrugs,
        GetDrugById,
        CreateMedicine,
        UpdateMedicine,
        DeleteMedicine,
        GetMedicineSearchHistory,
        AddMedicineSearch,
        DeleteMedicineSearchById,
        DeleteAllMedicineSearchItems

    }
}
