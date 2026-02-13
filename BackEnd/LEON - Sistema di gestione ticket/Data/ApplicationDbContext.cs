using LEON___Sistema_di_gestione_ticket.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LEON___Sistema_di_gestione_ticket.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DBSETS
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<TicketNote> TicketNotes => Set<TicketNote>();
        public DbSet<TicketStatusHistory> TicketStatusHistories => Set<TicketStatusHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ticket → Customer (opzionale)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Customer)
                .WithMany()
                .OnDelete(DeleteBehavior.SetNull);

            // Ticket → Notes
            modelBuilder.Entity<TicketNote>()
                .HasOne(n => n.Ticket)
                .WithMany(t => t.Notes)
                .HasForeignKey(n => n.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ticket → Status History
            modelBuilder.Entity<TicketStatusHistory>()
                .HasOne(h => h.Ticket)
                .WithMany(t => t.StatusHistories)
                .HasForeignKey(h => h.TicketId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
