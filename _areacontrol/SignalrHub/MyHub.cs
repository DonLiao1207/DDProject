using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using _AreaControl.Models;

namespace _AreaControl.SignalrHub {
    public class MyHub : Hub {
        static List<Tool> tooltime = new List<Tool>();
        public DDSEntities db = new DDSEntities();
        //啟動
        public void userpay(string id, string value, DateTime time) {
            int cash = 60 * Convert.ToInt32(value);
            var timeend = time.AddMinutes(Convert.ToInt32(value)).ToLocalTime();
            tooltime.Add(new Tool { id = id, timeEnd = timeend});
            Clients.All.getList2(id, cash);
        }
        //檢查時間
        public void checktime(string id, DateTime time) {
            var now = time.ToLocalTime();
            var query = from u in tooltime
                        where u.id == id
                        select u;
            var te = query.FirstOrDefault();
            if (te != null) {
                TimeSpan t = (te.timeEnd - now);
                var diff = (int)(t.TotalSeconds);
                Clients.All.render(id, diff);
            }
        }
        //確認是否預約
        public void ifres(string id) {
            var query = from u in tooltime
                        where u.id == id
                        select u;
            var ifrerver = query.FirstOrDefault();
            if (ifrerver != null) {
                if (ifrerver.status == true) {
                    tooltime.Remove(ifrerver);
                    Clients.All.resover(id, 60);
                }
                else {
                    tooltime.Remove(ifrerver);
                }
            }
            
        }
        //剔除
        public void kick(string kid) {
            string idaf = kid + "af";
            var query = from u in tooltime
                        where u.id == idaf
                        select u;
            var kickout = query.FirstOrDefault();
            tooltime.Remove(kickout);
        }
        //預約
        public void res(string id) {
            var sub = id.Substring(0, 2);
            var query = from u in tooltime
                        where u.id == sub
                        select u;
            var Reserver = query.FirstOrDefault();
            if (Reserver != null) {
                Reserver.status = true;
                Clients.All.restool(id, sub);
            }
        }
        //及時預約狀態
        public void checkres(string id) {
            var query = from u in tooltime
                        where id == u.id
                        select u;
            var Reserver = query.FirstOrDefault();
            if (Reserver != null) {
                if (Reserver.status == true) {
                    id = id + "textbtn";
                    Clients.All.restool(id, Reserver);

                }
                else {
                    return;
                }
            }
        }
        //確認是否預約(render)
        public void checkresaf(string id, DateTime time) {
            
            string idaf = id + "af";
            var query = from u in tooltime
                        where idaf == u.id
                        select u;
            var Reserver = query.FirstOrDefault();
            var now = time.ToLocalTime();

            if (Reserver != null) {
                TimeSpan t = (Reserver.timeEnd - now);
                var diff = (int)(t.TotalSeconds);

                if (Reserver.status == true) {
                    Clients.All.getList3(id, diff);
                }
                else {
                    return;
                }
            }
            
        }
       //預約時間啟動
        public void userpayres(string id, string value, DateTime time) {
            string idaf = id + "af";
            int cash = 60 * Convert.ToInt32(value);
            var timeend = time.AddMinutes(Convert.ToInt32(value)).ToLocalTime();
            tooltime.Add(new Tool { id = idaf, timeEnd = timeend, status=true});
            Clients.All.getList3(id, cash);//呼叫前端function
        }
    }
    }

