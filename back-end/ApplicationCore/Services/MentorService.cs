using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Responses.Mentors;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;

namespace ApplicationCore.Services
{
    public class MentorService : IMentorService
    {
        private readonly IMentorRepository _mentorRepository;

        public MentorService( IMentorRepository mentorRepository)
        {
            _mentorRepository = mentorRepository;
        }

        public async Task<OperationResult<PagedResult<MetorApplicantResponse>>> GetAllMentorApplications(PaginationParameters paginationParameters, string applicatioStatus)
        {
            var (mentors,totalCount) = await _mentorRepository.GetPagedAsync(
                filter: query => query.Where(x => x.ApplicationStatus.Name == applicatioStatus),
                pageIndex: paginationParameters.PageIndex,
                pageSize: paginationParameters.PageSize
            );
            var pagedResult = new PagedResult<MetorApplicantResponse>
            {
                TotalItems = totalCount,
                PageIndex = paginationParameters.PageIndex,
                PageSize = paginationParameters.PageSize,
                Items = mentors.ToMetorApplicantResponseList()
            };


            return OperationResult<PagedResult<MetorApplicantResponse>>.Ok(pagedResult);
        }
    }
}