using System.Net;
using System.Net.Http;
using System.Web;

using TFIP.Business.Contracts;
using TFIP.Business.Models;

namespace TFIP.Web.Api.Controllers
{
    using System.IO;
    using System.Net.Http.Headers;
    using System.Web.Http;
    using System.Web.Util;

    using TFIP.Web.Api.Models;

    public class AttachmentController : BaseApiController
    {
        private readonly IFileManagementService fileManagementService;

        public AttachmentController(IFileManagementService fileManagementService)
        {
            this.fileManagementService = fileManagementService;
        }

        [HttpPost]
        public HttpResponseMessage SaveAttachment()
        {
            if (HttpContext.Current.Request.Files.Count == 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "No files");
            }

            var file = HttpContext.Current.Request.Files[0];

            var result =
                ProcessViewModel<FileViewModel, ListItem>(
                    new FileViewModel { InputStream = file.InputStream, FileName = file.FileName },
                    null,
                    fileManagementService.SaveAttachmentToTempFolder);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        public HttpResponseMessage Download([FromUri]ListItem file)
        {
            if (fileManagementService.FileExists(file))
            {
                Stream fileStream = fileManagementService.GetFileStream(file);

                HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new StreamContent(fileStream);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = HttpUtility.UrlEncode(file.Value).Replace(@"+", @"%20");

                return response;
            }

            return this.Request.CreateErrorResponse(
                HttpStatusCode.BadRequest,
                "The file cannot be downloaded. Contact administrator for any questions.");
        }

        [HttpPost]
        public HttpResponseMessage DeleteAttachment(ListItem file)
        {
            return Request.CreateResponse(HttpStatusCode.OK, ProcessViewModel(file, null, fileManagementService.RemoveTempAttachment));
        }
    }
}