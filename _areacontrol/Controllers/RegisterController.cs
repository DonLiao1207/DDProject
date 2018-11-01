using _AreaControl.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace _AreaControl.Controllers
{
    public class RegisterController : Controller
    {
        // GET: Register
        DDSEntities db = new DDSEntities();
        public ActionResult Index() {
            return View();
        }
        public JsonResult SaveData(UserList model) {
            model.Isvalid = false;
            db.UserLists.Add(model);
            db.SaveChanges();
            BuildEmailTemplate(model.ID);
            return Json("Registration Successfull", JsonRequestBehavior.AllowGet);
        }
        public ActionResult Confirm(int regId) {
            ViewBag.regID = regId;
            return View();
        }
        public JsonResult RegisterConfirm(int regId) {
            UserList Data = db.UserLists.Where(x => x.ID == regId).FirstOrDefault();
            Data.Isvalid = true;
            db.SaveChanges();
            var msg = "Your Email Is Verified!";
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        public void BuildEmailTemplate(int regID) {
            string body = System.IO.File.ReadAllText(HostingEnvironment.MapPath("~/EmailTemplate/") + "Text" + ".cshtml");
            var regInfo = db.UserLists.Where(x => x.ID == regID).FirstOrDefault();
            var url = "http://localhost:9225/" + "/Register/Confirm?regID=" + regID;
            body = body.Replace("@ViewBag.ConfirmationLink", url);
            body = body.ToString();

            BuildEmailTemplate("Your Account Is Successfully Created", body, regInfo.Email);

        }

        public static void BuildEmailTemplate(string subjectText, string bodyText, string sendTo) {
            string from, to, bcc, cc, subject, body;
            from = "ddliao77127@gmail.com";
            to = sendTo;
            bcc = "";
            cc = "";
            subject = subjectText;
            StringBuilder sb = new StringBuilder();
            sb.Append(bodyText);
            body = sb.ToString();
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(from);
            mail.To.Add(new MailAddress(to));
            if (!string.IsNullOrEmpty(bcc)) {
                mail.Bcc.Add(new MailAddress(bcc));
            }
            if (!string.IsNullOrEmpty(cc)) {
                mail.CC.Add(new MailAddress(cc));
            }
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = true;
            SendEmail(mail);
        }

        public static void SendEmail(MailMessage mail) {
            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;

            client.UseDefaultCredentials = false;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.Credentials = new System.Net.NetworkCredential("ddliao77127@gmail.com", "0972178519");
            client.EnableSsl = true;
            System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate (object s,
                        System.Security.Cryptography.X509Certificates.X509Certificate certificate,
                        System.Security.Cryptography.X509Certificates.X509Chain chain,
                        System.Net.Security.SslPolicyErrors sslPolicyErrors) {
                            return true;
                        };
            try {
                client.Send(mail);
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public JsonResult CheckValidUser(UserList model) {
            string result = "Fail";
            UserList Data = db.UserLists.Where(x => x.Email == model.Email && x.Password == model.Password && x.Isvalid == true).SingleOrDefault();
            var DataItem = db.UserLists.Where(x => x.Email == model.Email && x.Password == model.Password && x.Isvalid == true).SingleOrDefault();
            if (DataItem != null) {
                Session["UserID"] = DataItem.ID.ToString();
                Session["UserName"] = DataItem.UserName.ToString();
                var ti = Convert.ToInt32(Data.Times) + 1;
                Data.Times = ti.ToString();
                db.SaveChanges();
                result = "Success";
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AfterLogin() {
            if (Session["UserID"] != null) {
                return RedirectToAction("/Home/Index");
            }
            else {
                return RedirectToAction("Index");
            }
        }
        
        public JsonResult CheckUsernameAvailability(string userdata) {
            System.Threading.Thread.Sleep(200);
            var SeachData = db.UserLists.Where(x => x.Email == userdata).SingleOrDefault();

            if (SeachData != null) {
                return Json(1);
            }
            else {
                return Json(0);
            }

        }
    }

}