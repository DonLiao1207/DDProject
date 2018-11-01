using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using _AreaControl.Models;

namespace _AreaControl.SignalrHub {

    public class ChatHub : Hub {
        //目前所有連線的list
        static List<userData> UserData = new List<userData>(0);
        static List<ChatMsg> Msg = new List<ChatMsg>(0);
        
        //使用者連線 加入清單
        public void userConnected(string name) {
            var query = from u in UserData
                        where u.id == name
                        select u;
            if (query.Count() == 0) {
                UserData.Add(new userData { id = name, ip = Context.ConnectionId });
                Clients.All.getList(UserData);
                var query2 = from u in Msg
                             where u.Name == name
                             select u;
                if (query2.Count() == 0) {
                    Msg.Add(new ChatMsg {Name = name});
                }
            }
        }
        //離開時清除清單
        public override Task OnDisconnected(bool stop) {
            Clients.All.removeList(Context.ConnectionId);
            var item = UserData.FirstOrDefault(x => x.ip == Context.ConnectionId);
            if (item != null) {
                UserData.Remove(item);//刪除                
                Clients.All.onUserDisconnected(item.id);     
            }
            return base.OnDisconnected(stop);
        }

        //發信
        public void Send(string name, string message, string to) {
            
            Msg.Add(new ChatMsg { Name = name, msg = message,  pm=to});
            Clients.All.addNewMessageToPage(name, message, to);
        }

        //訊息紀錄
        public void msglist(string ser, string pmuser) {
            var itemS = Msg.Where(x => x.Name == ser && x.pm == pmuser);
            var itemP = Msg.Where(x => x.Name == pmuser);

            var s = itemS.ToList();
            var p = itemP.ToList();
            Clients.All.listmsg(pmuser,s,p);
        }

    }




}
