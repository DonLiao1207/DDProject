using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(_AreaControl.Startup))]
namespace _AreaControl
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            ConfigureAuth(app);
        }
    }
}
