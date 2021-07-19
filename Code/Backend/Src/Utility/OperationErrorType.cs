namespace Backend.Utility
{
    public enum OperationErrorType
    {
        Unknown = 0,

        #region Common

        Common = 1000,
        HttpsRequired,
        ApiModelValidation,
        RequestBodyNotFound,
        ConcurrencyUpdate,
        DataConflict,
        EntityNotFound,
        PermissionDenied,
        FailedToConnect,
        UserRegistrationError,
        WrongSortedFieldName,
        ServiceWasNotInitialized,
        EntityValidationError,
        EmailProviderError,
        EntityNotExists,
        AspNetIdentityError,
        EmailAlreadyConfirmed,
        EmailWasNotConfirmedYet,
        WrongLoginInfo,
        RoleCreationError,
        AccounNotExist,
        
        #endregion

        #region User

        UserEmailExists = 2000,
        WrongInputParameter = 2001,

        #endregion

    }
}
