using LEON___Sistema_di_gestione_ticket.Data;
using LEON___Sistema_di_gestione_ticket.Data.Seed;
using LEON___Sistema_di_gestione_ticket.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Logging;
using LEON___Sistema_di_gestione_ticket.Contracts;
using Microsoft.AspNetCore.Authentication;

// Create a new web application builder
var builder = WebApplication.CreateBuilder(args);

// DATABASE SETUP - Configuration of Entity Framework Core with SQL Server using the connection string from appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer"))
);

//Services for Identity - Configurazione di ASP.NET Core Identity per la gestione degli utenti e dei ruoli, utilizzando Entity Framework Core per la persistenza dei dati
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// AUTHENTICATION & AUTHORIZATION
/* JWT Settings reads from appsettings.json - Lettura dei parametri di configurazione JWT da appsettings.json */
// section JWT with parameters: Issuer, Audience, Key (the key should be at least 32 characters for HMACSHA256)

var jwtSection = builder.Configuration.GetSection("Jwt");
var issuer = jwtSection["Issuer"];
var audience = jwtSection["Audience"];
var key = jwtSection["Key"];

// Validation of JWT parameters to ensure they are properly set and the key is of sufficient length for security
if (string.IsNullOrWhiteSpace(key) || key.Length < 32)
    throw new InvalidOperationException("JWT key missing or too short.");

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // Disables the default mapping of JWT claims to Microsoft identity model claims, allowing for more control over claim types in the application

IdentityModelEventSource.ShowPII = true; // temporary setting to show Personally Identifiable Information in logs for debugging purposes, should be set to false in production for security reasons

// Authentication
/* JWT Bearer: Configuration of JWT Bearer authentication, setting up the token validation parameters to ensure that incoming JWT tokens are properly validated against the expected issuer, audience, signing key, and other security parameters. This setup allows the application to authenticate users based on JWT tokens provided in the Authorization header of HTTP requests. For more details, see
   https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt Bearer */
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Parametri di validazione del token JWT 
            ValidateIssuer = true,
            // Issuer del token atteso 
            ValidIssuer = issuer,
            // Audience del token atteso
            ValidateAudience = true,
            // Audience del token atteso
            ValidAudience = audience,
            // Chiave di firma del token attesa
            ValidateIssuerSigningKey = true,
            // Creazione della chiave di firma simmetrica
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            // Validazione della durata del token
            ValidateLifetime = true,
            // Nessun clock skew permesso (per test e sviluppo) 
            ClockSkew = TimeSpan.Zero,
            // Mappatura dei claim per Identity 
            RoleClaimType = ClaimTypes.Role,
            // Mappatura del claim Name per Identity 
            NameClaimType = JwtRegisteredClaimNames.Sub
        };

        // Events per logging
        options.Events = new JwtBearerEvents
        {
            // Log degli eventi di autenticazione per il debug
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"JWT auth failed: {ctx.Exception}");
                return Task.CompletedTask;
            },
            // Log dei challenge JWT
            OnChallenge = ctx =>
            {
                Console.WriteLine($"JWT challenge: {ctx.Error}, {ctx.ErrorDescription}");
                return Task.CompletedTask;
            },
            // Log della validazione del token JWT
            OnTokenValidated = ctx =>
            {
                var exp = ctx.Principal?.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;
                Console.WriteLine($"JWT validated. exp={exp}");
                return Task.CompletedTask;
            }
        };
    })
    ;

// Aggiunge i servizi di autorizzazione https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction
builder.Services.AddAuthorization();

// SWAGGER SETUP - Configurazione di Swagger per la documentazione delle API
builder.Services.AddSwaggerGen(options =>
{
    // Definizione del documento Swagger con informazioni sull'API 
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Leon API",
        Version = "v1",
        Description = "Sistema di Ticket di Supporto – API"
    });

    // Configurazione di Swagger per l'uso dell'autenticazione JWT Bearer nella UI di Swagger 
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Inserisci: Bearer {token}"
    });

    // Aggiunge il requisito di sicurezza per l'uso del token Bearer nelle richieste API 
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                // riferimento alla definizione di sicurezza sopra 
                Reference = new OpenApiReference
                {
                    // tipo di riferimento a uno schema di sicurezza 
                    Type = ReferenceType.SecurityScheme,
                    // id dello schema di sicurezza 
                    Id = "Bearer"
                }
            },
            // array di scope richiesti (vuoto per JWT Bearer) 
            Array.Empty<string>()
        }
    });
});

// Removed redundant default authentication registration to avoid duplicate scheme setup

// CONTROLLER SETUP - Aggiunge i controller e configura le opzioni JSON per serializzare gli enum come stringhe
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
    );

builder.Services.AddEndpointsApiExplorer();

// Servizi personalizzati per la gestione dei ticket e l'autenticazione
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISmsService, SmsService>();

//Configurazione di CORS per permettere richieste cross-origin dall'app frontend
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins is { Length: > 0 })
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        else
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); // solo per test/dev
    });
});



// costtruzione dell'app web 
var app = builder.Build();

// Swagger Middleware
app.UseSwagger();
app.UseSwaggerUI();

//Seed dei ruoli all'avvio dell'applicazione
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (dbContext.Database.IsRelational())
        await dbContext.Database.MigrateAsync();   // 1) prima crea tabelle

    await RoleSeeder.SeedRolesAsync(scope.ServiceProvider); // 2) poi seed ruoli
}
// MIDDLEWARE SETUP    
app.UseHttpsRedirection();

// Abilita CORS Cors serve per permettere richieste cross-origin dall'app frontend 
app.UseCors();

// Abilita l'autenticazione e l'autorizzazione 
app.UseAuthentication();
app.UseAuthorization();

// Mappa i controller alle rotte
app.MapControllers();

app.Run();
