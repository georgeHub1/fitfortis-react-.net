namespace Backend.Exceptions
{
    public class NotExistedAccountException : BaseException
    {
        public NotExistedAccountException(string message) : base(message)
        {
        }

        public NotExistedAccountException(string message, System.Exception innerException) : base(message, innerException)
        {
        }
    }
}
