using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFIP.Business.Contracts;

namespace TFIP.Web.Api.Controllers
{
    public class ValuesController : BaseApiController
    {
        private readonly IMiaService miaService;
        private readonly INbrbService nbrbService;

        public ValuesController(
            IMiaService miaService,
            INbrbService nbrbService
            )
        {
            this.miaService = miaService;
            this.nbrbService = nbrbService;
        }

        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

        [HttpGet]
        public HttpResponseMessage TestMiaDb()
        {
            return Request.CreateResponse(HttpStatusCode.OK, miaService.IsInMiaDb("123"));
        }

        [HttpGet]
        public HttpResponseMessage TestNbrbDb()
        {
            return Request.CreateResponse(HttpStatusCode.OK, nbrbService.IsInNbrbDb("123"));
        }
    }
}
