namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatisticsResponseDto> GetDashboardStatisticsAsync();
    }
}
