using _AreaControl.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace _AreaControl.Controllers {
    public class HomeController : Controller {
        public DDSEntities db = new DDSEntities();
        //登入
        public ActionResult Login() {
            return View();
        }
        public ActionResult log() {
            return View();
        }

        public ActionResult Product() {
            return View();
        }
        //主頁
        public ActionResult Index() {
            return View();
            
        }
        //創造區
        public ActionResult WorkSpace() {
            if (Session["UserID"] != null) {
                return View();
            }
            else {
                return RedirectToAction("Login");
            }
        }
        //檢視區
        public ActionResult Check() {
            return View();
        }
        //編輯區
        public ActionResult Object() {
            
            return View(db.Areas.ToList());

        }

        public ActionResult Logout() {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index");
        }

        public JsonResult SaveData(AreaContent model) {
            
            db.AreaContents.Add(model);
            db.SaveChanges();
            return Json("Successfull", JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveForm(Area model) {
            db.Areas.Add(model);
            db.SaveChanges();
            return Json("Successfull", JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(int? id) {
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Area A = db.Areas.Find(id);
            if (A == null) {
                return HttpNotFound();
            }
            return View(A);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="AreaID,Owner,AreaName,Row,Col,Height,Width,BtDis,RtDis")] Area A) {
            if (ModelState.IsValid) {
                db.Entry(A).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(A);
        }

        public ActionResult Delete(int? id) {
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Area A = db.Areas.Find(id);
            if (A == null) {
                return HttpNotFound();
            }
            return View(A);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id) {
            Area A = db.Areas.Find(id);
            db.Areas.Remove(A);
            db.SaveChanges();
            return RedirectToAction("Object");
        }
    }
}