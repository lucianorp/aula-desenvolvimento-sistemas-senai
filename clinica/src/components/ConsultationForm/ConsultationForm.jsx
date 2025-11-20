import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importa o componente Modal
import Modal from "../../components/Modal";

const ConsultationForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    description: "",
    medication: "",
    dosagePrecautions: "",
  });

  // Busca pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Erro ao obter dados dos pacientes:", error);
      }
    };
    fetchPatients();
  }, []);

  // Funções auxiliares
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm)
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      date: "",
      time: "",
      description: "",
      medication: "",
      dosagePrecautions: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      setIsSaving(true);
      const dataToSave = {
        patientId: selectedPatient.id,
        ...formData,
      };

      await axios.post("http://localhost:3000/consults", dataToSave);
      toast.success("Consulta cadastrada com sucesso!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });

      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      toast.error("Erro ao cadastrar consulta!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="p-6 text-gray-800">
      {/* Campo de busca */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Buscar paciente para cadastrar consulta
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Digite o nome ou registro do paciente"
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
        />
      </div>

      {/* Lista de pacientes */}
      <ul className="space-y-3">
        {filteredPatients.map((patient) => (
          <li
            key={patient.id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-sm">
                <strong>Registro:</strong> {patient.id}
              </p>
              <p className="text-sm">
                <strong>Nome:</strong> {patient.fullName}
              </p>
              <p className="text-sm">
                <strong>Convênio:</strong> {patient.healthInsurance}
              </p>
            </div>
            <button
              onClick={() => handleSelectPatient(patient)}
              className="bg-cyan-700 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition"
            >
              Selecionar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de cadastro da consulta */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPatient && (
          <>
            {/* Título */}
            <h2 className="text-lg font-bold mb-4 text-cyan-700">
              Cadastrar consulta para {selectedPatient.fullName}
            </h2>

            {/* Dados básicos */}
            <div className="mb-4 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Telefone:</strong> {selectedPatient.phone}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Motivo da Consulta
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição do Problema
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Medicação Receitada
                </label>
                <input
                  type="text"
                  name="medication"
                  value={formData.medication}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Dosagem e Precauções
                </label>
                <textarea
                  name="dosagePrecautions"
                  value={formData.dosagePrecautions}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      <ToastContainer />
    </section>
  );
};

export default ConsultationForm;
