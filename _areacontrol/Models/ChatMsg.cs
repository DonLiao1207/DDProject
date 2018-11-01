using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _AreaControl.Models {
    public class ChatMsg{
        public string Name { get; set; }
        public string msg { get; set; }
        public string ip { get; set; }
        public DateTime Ctime { get; set; }
        public string pm { get; set; }
    }
}