import { useState, useEffect } from "react";
import { translateErrorMessage } from "../../Utils/errorTranslations";
import type UserDetails from "../../Interfaces/UserDetails.model";
import type GetCustomerDto from "../../Interfaces/GetCustomer.model";
import SuccessPopup from "./SuccessPopup"; // Import the new component

export default function CreateTicket() {
  // RECUPERO TOKEN DAL LOCAL STORAGE
  const token = localStorage.getItem("token");
  // URL DELL'API DI CREAZIONE TICKET
  const apiUrl = import.meta.env.VITE_API_URL + "/api/Tickets";
  const allUsersApiUrl = import.meta.env.VITE_API_URL + "/api/Auth/all-users";
  const allCustomersApiUrl =
    import.meta.env.VITE_API_URL + "/api/Customers/all";
  const prioritiesApiUrl =
    import.meta.env.VITE_API_URL + "/api/Enums/priorities";

  // STATE PER I CAMPI DEL MODULO DI CREAZIONE TICKET
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("");
  const [initialStatus, setInitialStatus] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [fullName, setFullName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  // STATI PER LA GESTIONE DEGLI AGENTI E DEL LORO CARICAMENTO
  const [availableAgents, setAvailableAgents] = useState<UserDetails[] | null>(
    null,
  );
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [priorities, setPriorities] = useState<string[]>([]);

  // STATO PER GLI ERRORI DI REGISTRAZIONE
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  // STATI PER LA GESTIONE DEI CLIENTI E DEL LORO CARICAMENTO
  const [availableCustomers, setAvailableCustomers] = useState<
    GetCustomerDto[] | null
  >(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [isNewCustomer, setIsNewCustomer] = useState(true); // true per creare un nuovo cliente, false per selezionarne uno esistente
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        console.error("No token found, cannot fetch initial data.");
        setLoadingAgents(false);
        setLoadingCustomers(false);
        return;
      }

      try {
        // Fetch agents
        const agentsResponse = await fetch(allUsersApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!agentsResponse.ok) {
          throw new Error(
            `Failed to fetch agents: ${agentsResponse.statusText}`,
          );
        }
        const agentsData = await agentsResponse.json();
        setAvailableAgents(agentsData);
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoadingAgents(false);
      }

      try {
        // Fetch customers
        const customersResponse = await fetch(allCustomersApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!customersResponse.ok) {
          throw new Error(
            `Failed to fetch customers: ${customersResponse.statusText}`,
          );
        }
        const customersData = await customersResponse.json();
        setAvailableCustomers(customersData);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoadingCustomers(false);
      }

      try {
        // Fetch priorities
        const prioritiesResponse = await fetch(prioritiesApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!prioritiesResponse.ok) {
          throw new Error(
            `Failed to fetch priorities: ${prioritiesResponse.statusText}`,
          );
        }
        const prioritiesData = await prioritiesResponse.json();
        setPriorities(prioritiesData);
      } catch (err) {
        console.error("Error fetching priorities:", err);
      }
    };
    fetchInitialData();
  }, [token, allUsersApiUrl, allCustomersApiUrl, prioritiesApiUrl]);

  const handleCreateTicket = (e: React.FormEvent) => {
    // LOGICA PER LA CREAZIONE DEL TICKET
    e.preventDefault();

    // VERIFICA CHE IL DIPARTIMENTO SIA SELEZIONATO
    if (!targetDepartment) {
      setError("Devi selezionare un dipartimento");
      return;
    }

    const ticketData: {
      title: string;
      description: string;
      priority: string;
      targetDepartment: string;
      initialStatus: string | null;
      AssignedAgent: string | null;
      notes: { content: string };
      CustomerId?: number; // Optional: for existing customer
      customer?: {
        // Optional: for new customer
        fullName: string;
        phoneNumber: string;
        email: string;
      };
    } = {
      title: title,
      description: description,
      priority: priority,
      targetDepartment: targetDepartment,
      initialStatus: initialStatus || null,
      AssignedAgent: assignedAgent || null,
      notes: {
        content: notes,
      },
    };

    if (isNewCustomer) {
      if (!fullName || !customerEmail || !customerPhoneNumber) {
        setError("Please fill in all new customer details.");
        return;
      }
      ticketData.customer = {
        fullName: fullName,
        phoneNumber: customerPhoneNumber,
        email: customerEmail,
      };
    } else if (selectedCustomerId) {
      ticketData.CustomerId = Number(selectedCustomerId); // Ensure it's a number for backend
    } else {
      setError("Please select an existing customer or create a new one.");
      return;
    }

    // LOG PER DEBUG
    console.log("Sending ticket data:", ticketData);
    console.log("Target Department:", targetDepartment);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    })
      .then(async (response) => {
        // PROVA A LEGGERE IL JSON (SIA PER SUCCESSO CHE ERRORE)
        let responseData = null;
        try {
          const text = await response.text();
          if (text) {
            responseData = JSON.parse(text);
          }
        } catch {
          console.log("Risposta non è JSON valido o vuota");
        }

        if (!response.ok) {
          // GESTIONE ERRORE
          let errorMessage = "Creazione ticket fallita";

          if (responseData) {
            if (responseData.message) {
              errorMessage = responseData.message;
            }
            if (responseData.errors && Array.isArray(responseData.errors)) {
              errorMessage += ": " + responseData.errors.join(", ");
            } else if (
              responseData.errors &&
              typeof responseData.errors === "object"
            ) {
              const errorMessages = Object.values(responseData.errors)
                .flat()
                .join(", ");
              if (errorMessages) {
                errorMessage += ": " + errorMessages;
              }
            }
          }

          throw new Error(errorMessage);
        }

        // SUCCESSO - RITORNA I DATI
        return responseData;
      })
      .then((data) => {
        // GESTIONE RISPOSTA DI SUCCESSO
        console.log("Ticket creato con successo:", data);
        setError(""); // Pulisce errori precedenti
        setPopupMessage(
          "✅ Ticket creato con successo! You will be redirected to the dashboard soon.",
        );
        setShowSuccessPopup(true);

        // RESETTA IL FORM
        setTitle("");
        setDescription("");
        setPriority("");
        setTargetDepartment("");
        setInitialStatus("");
        setAssignedAgent("");
        setNotes("");
        // Reset customer specific states
        setFullName("");
        setCustomerPhoneNumber("");
        setCustomerEmail("");
        setSelectedCustomerId("");
        setIsNewCustomer(true); // Default to creating a new customer after submission

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        // GESTIONE ERRORE
        console.error("Errore creazione ticket:", error);
        const errorMessage =
          error.message || "Creazione ticket fallita. Riprova.";
        setError(translateErrorMessage(errorMessage));
      });
  };

  return (
    <>
      {showSuccessPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div
        className="container"
        style={{ paddingBottom: 20, color: "#6C757D" }}
      >
        <div style={{ textAlign: "center" }}>
          <h4>Create New Ticket</h4>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleCreateTicket} style={{ padding: 20 }}>
          {/* CAMPI DEL MODULO DI CREAZIONE TICKET */}{" "}
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="priority" className="form-label">
              Choose a Priority:
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Priority
              </option>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="department" className="form-label">
              Choose a Department:
            </label>
            <select
              id="department"
              name="department"
              className="form-select"
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CallCenter">CallCenter</option>
              <option value="TechSupport">TechSupport</option>
              <option value="Billing">Billing</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="status" className="form-label">
              Choose a Status:
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={initialStatus}
              onChange={(e) => setInitialStatus(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Open">Open</option>
              <option value="InProgress">InProgress</option>
              <option value="WaitingDepartment">WaitingDepartment</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="assignedAgent" className="form-label">
              Agent Assignment:
            </label>
            {loadingAgents ? (
              <p>Loading agents...</p>
            ) : (
              <select
                id="assignedAgent"
                name="assignedAgent"
                className="form-select"
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
              >
                <option value=""> Select Agent</option>
                {availableAgents &&
                  availableAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName} - {agent.agentType}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="mb-2">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              style={{ height: "100px", resize: "none" }}
            />
          </div>
          <label className="form-label">Customer Information</label>
          <div className="mb-3 d-flex align-items-center">
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="toggleNewCustomer"
                checked={isNewCustomer}
                onChange={() => {
                  setIsNewCustomer(!isNewCustomer);
                  setSelectedCustomerId(""); // Clear selection when toggling
                  setFullName(""); // Clear new customer fields
                  setCustomerEmail("");
                  setCustomerPhoneNumber("");
                }}
              />
              <label className="form-check-label" htmlFor="toggleNewCustomer">
                {isNewCustomer
                  ? "Create New Customer"
                  : "Select Existing Customer"}
              </label>
            </div>
            {loadingCustomers && (
              <p className="mb-0 text-muted">Loading customers...</p>
            )}
          </div>
          {!loadingCustomers && !isNewCustomer && (
            <div className="mb-2">
              <label htmlFor="selectCustomer" className="form-label">
                Select Customer:
              </label>
              <select
                id="selectCustomer"
                name="selectCustomer"
                className="form-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required={!isNewCustomer}
              >
                <option value="" disabled>
                  Select an existing customer
                </option>
                {availableCustomers &&
                  availableCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName} ({customer.email})
                    </option>
                  ))}
              </select>
            </div>
          )}
          {!loadingCustomers && isNewCustomer && (
            <>
              <div className="mb-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isNewCustomer}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required={isNewCustomer}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerPhoneNumber}
                  onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                  required={isNewCustomer}
                />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Create Ticket
          </button>
        </form>
      </div>
    </>
  );
}
