using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using _AreaControl.Models;
using Microsoft.AspNet.SignalR;
using _AreaControl.SignalrHub;

namespace _AreaControl.Controllers
{
    public class UserController : Controller
    {
        private DDSEntities db = new DDSEntities();

        // GET: User
        public ActionResult Index()
        {
            return View(db.UserLists.ToList());
        }
        static List<Tool> tooltime = new List<Tool>(0);

        public ActionResult Link(string id) {
            var who = Convert.ToInt32(Session["UserID"]);
            var query = from u in db.UserLists
                        where u.ID == who
                        select u;
            var whouse = query.FirstOrDefault();
            if (whouse != null) {
                var money = Convert.ToInt32(whouse.Credit) - 60;
                whouse.Credit = money.ToString();
                db.SaveChanges();
                var hubContext = GlobalHost.ConnectionManager.GetHubContext<MyHub>();
                hubContext.Clients.All.call(id);
                return RedirectToAction("Member");
            }
            else {
                return RedirectToAction("Login", "Home");
            }
        }
        public ActionResult Member(int? id) {
            if (Session["UserID"] != null) {
                id = Convert.ToInt32(Session["UserID"]);
                if (id == null) {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }
                UserList user = db.UserLists.Find(id);

                if (user == null) {
                    return HttpNotFound();
                }
                return View(user);
            }
            else {
                //return View();
                return RedirectToAction("Login","Home");
            }
            
        }
        public ActionResult Coin(int? id) {
            id = Convert.ToInt32(Session["UserID"]);
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList user = db.UserLists.Find(id);

            if (user == null) {
                return HttpNotFound();
            }
            return View(user);
            
        }


        public ActionResult Safe(int? id) {
            id = Convert.ToInt32(Session["UserID"]);

            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList user = db.UserLists.Find(id);

            if (user == null) {
                return HttpNotFound();
            }
            return View(user);
        }
        // GET: User/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList userList = db.UserLists.Find(id);
            if (userList == null)
            {
                return HttpNotFound();
            }
            return View(userList);
        }

        // GET: User/Create
        public ActionResult Create(int? id)
        {
            id = Convert.ToInt32(Session["UserID"]);
            UserList user = db.UserLists.Find(id);
            var checktimes = Convert.ToInt32(user.Times);
            string two = "2";
            if (checktimes == 1) {
                user.Times = two;
                db.SaveChanges();
            }
            
            return View(user);
        }

        // POST: User/Create
        // 若要免於過量張貼攻擊，請啟用想要繫結的特定屬性，如需
        // 詳細資訊，請參閱 http://go.microsoft.com/fwlink/?LinkId=317598。
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,UserName,Email,Password,Isvalid")] UserList userList)
        {
            if (ModelState.IsValid)
            {
                db.UserLists.Add(userList);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(userList);
        }

        // GET: User/Edit/5
        public ActionResult Edit(int? id)
        {   
            id = Convert.ToInt32(Session["UserID"]);
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList user = db.UserLists.Find(id);
            var checktimes = Convert.ToInt32(user.Times);
            string two = "2";
            if (checktimes == 1) {
                user.Times = two;
                db.SaveChanges();
            }
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        // POST: User/Edit/5
        // 若要免於過量張貼攻擊，請啟用想要繫結的特定屬性，如需
        // 詳細資訊，請參閱 http://go.microsoft.com/fwlink/?LinkId=317598。
        public JsonResult Edited(UserList userList)
        {
            var id = Convert.ToInt32(Session["UserID"]);
            UserList data= db.UserLists.Find(id);
            data.Name = userList.Name;
            data.Phone = userList.Phone;
            data.Address = userList.Address;
            db.SaveChanges();
            string msg = "ok";
            return Json(msg, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Credit(int? id) {
            id = Convert.ToInt32(Session["UserID"]);
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList user = db.UserLists.Find(id);
            if (user == null) {
                return HttpNotFound();
            }
            return View(user);
        }

              public JsonResult ChangePassword(UserList userList) 
        {
            var id = Convert.ToInt32(Session["UserID"]);
            UserList data = db.UserLists.Find(id);
            data.Password = userList.Password;
            db.SaveChanges();
            string msg = "更改完成";
            return Json(msg, JsonRequestBehavior.AllowGet);
        }


        // GET: User/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserList userList = db.UserLists.Find(id);
            if (userList == null)
            {
                return HttpNotFound();
            }
            return View(userList);
        }

        // POST: User/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            UserList userList = db.UserLists.Find(id);
            db.UserLists.Remove(userList);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
