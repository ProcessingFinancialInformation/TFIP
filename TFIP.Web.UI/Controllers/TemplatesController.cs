namespace TFIP.Web.UI.Controllers
{
    using System.Web.Mvc;

    public class TemplatesController : Controller
    {
        // GET: Templates
        public ActionResult TextFieldInput()
        {
            return this.PartialView();
        }

        public ActionResult DateFieldInput()
        {
            return this.PartialView();
        }

        public ActionResult SelectFieldInput()
        {
            return this.PartialView();
        }

        public ActionResult SimpleMetadataTemplate()
        {
            return this.PartialView();
        }

        public ActionResult RadioFieldInput()
        {
            return this.PartialView();
        }

        public ActionResult CheckBoxFieldInput()
        {
            return this.PartialView();
        }

        public ActionResult TextAreaFieldInput()
        {
            return this.PartialView();
        }
    }
}