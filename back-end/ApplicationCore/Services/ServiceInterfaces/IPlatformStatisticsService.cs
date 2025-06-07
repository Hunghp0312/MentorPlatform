using ApplicationCore.DTOs.Responses.Dashboard;

namespace ApplicationCore.Services.ServiceInterfaces
{
    public interface IPlatformStatisticsService
    {
        Task<PlatformStatisticsResponseDto> GetPlatformStatisticsAsync();
    }
}