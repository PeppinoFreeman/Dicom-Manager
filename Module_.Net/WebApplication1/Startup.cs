using System.Reflection;
using Azure.Storage.Blobs;
using Microsoft.OpenApi.Models;
using WebApplication1.Case.Db;

namespace WebApplication1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<ICaseRepository, CaseRepository>();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo()
                {
                    Description = "This is an API (in Asp .Net Core v8) offering basic CRUD operations on DICOM files",
                    Title = "DICOM Manager API",
                    Version = "v1",
                    TermsOfService = new Uri("https://www.icann.org/privacy/tos"),
                    Contact = new OpenApiContact
                    {
                        Name = "Github",
                        Url = new Uri("https://github.com/PeppinoFreeman/Dicom-Manager")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "License",
                        Url = new Uri("https://example.com/license")
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder =>
                    {
                        builder.WithOrigins(Configuration.GetSection("AllowedOrigin").Value)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.AddControllers();
            services.AddSingleton(x => new BlobServiceClient(Configuration.GetConnectionString("AzureBlobStorage")));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowSpecificOrigin");

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // Configure the HTTP request pipeline.
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                });
            }
        }
    }
}
