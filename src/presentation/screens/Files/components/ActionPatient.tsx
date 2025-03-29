import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEllipsisVertical, FaEye, FaIdCard } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import { usePatientStore } from "../store/patient.store";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import { useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../../../../interfaces/patient.interface";
import { useConfirmStore } from "../../../storage/confim.storage";
import { useDeletePatient } from "../query/patient.query";
import { IoIosDocument } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { IConsult } from "../../../../interfaces/consult.interface";
import { useGetConsultByPatientId } from "../query/consult.query";
import { SiFiles } from "react-icons/si";
import { useState } from "react";

interface IProps {
  id: string;
}

export function ActionPatient({ id }: IProps) {
  const { toggleForm, setModeForm, setPatient } = usePatientStore();
  const { status: statusDeletePatient, mutate: handleDeletePatient } =
    useDeletePatient();
  const clientQuery = useQueryClient();
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  const navigate = useNavigate();

  const handleUpdate = () => {
    const patient = (
      clientQuery.getQueryData<IPatient[]>(["getAllPatient"]) ?? []
    ).find((patient) => patient.id === id);

    if (!patient) return;

    setPatient(patient);
    setModeForm(MODEFORMENUM.UPDATE);
    toggleForm();
  };

  const handleDelete = () => {
    showConfirm("Eliminar", "¿Desea eliminar el paciente?", () => {
      handleDeletePatient(id);
    });
  };

  const handleGenerateFicha = () => {
    const patient = (
      clientQuery.getQueryData<IPatient[]>(["getAllPatient"]) ?? []
    ).find((patient) => patient.id === id);

    if (!patient) {
      alert("No se encontró el paciente.");
      return;
    }

    // console.log("patient Data:", patient);

    const doc = new jsPDF("landscape");

    const clinicaData = localStorage.getItem("clinicaData");

    if (clinicaData) {
      // Convierte el string a un objeto si la data fue almacenada como JSON
      const parsedData = JSON.parse(clinicaData);
      console.log(parsedData);
      doc.addImage(
        parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
        "JPEG", // Formato de la imagen
        10, // Posición X
        0, // Posición Y
        50, // Ancho
        50 // Alto
      );
      // // Agregar los textos

      doc.setFont("helvetica", "bold");
      doc.text(`Clinica ${parsedData.nombre}`, 52, 20);
      doc.setFontSize(12);
      doc.text(`COD Clínica: ${parsedData.codigo}`, 220, 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setFont("helvetica", "bold");
      doc.text("Direccion:", 52, 26);
      doc.setFont("helvetica", "normal");
      doc.text(parsedData.direccion, 80, 26);
      const texto =
        "Atención personalizada para el diagnóstico, tratamiento y seguimiento de enfermedades comunes, infecciones, dolencias y problemas de salud generales.";

      const maxCaracteresPorLinea = 80; // Máximo de caracteres antes del salto
      const lineas = []; // Array para almacenar las líneas

      // Dividir el texto en partes de máximo 52 caracteres
      for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
        lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
      }

      // Imprimir cada línea en una posición diferente en Y
      let y = 32; // Posición inicial en el eje Y
      lineas.forEach((linea) => {
        doc.text(linea, 52, y);
        y += 6; // Incrementar Y para la siguiente línea
      });
      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text("Teléfono:", 20, 200);
      doc.setFont("helvetica", "normal"); // Volver a fuente normal
      doc.text(parsedData.telefono, 47, 200); // Ajustar la posición para que quede al lado

      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text("Horario Atención:", 196, 200);
      doc.setFont("helvetica", "normal"); // Volver a fuente normal
      doc.text(parsedData.horario, 245, 200); // Ajustar la posición para que quede alineado
    } else {
      console.log("No se encontró información en localStorage");
    }

    // Eliminar letras y símbolos, quedándonos solo con los números
    let numbersOnly = patient?.id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

    // Obtener solo los primeros 6 números
    let firstSixNumbers = numbersOnly.substring(0, 6);

    // Concatenar con el texto
    doc.setFont("helvetica", "bold");
    doc.text(`Código Expediente: ${firstSixNumbers}`, 20, 52);
    doc.setFont("helvetica", "normal");

    autoTable(doc, {
      body: [
        [
          {
            content: "Ficha del Paciente",
            styles: {
              fontStyle: "bold",
              fontSize: 30,
              fillColor: [0, 76, 153],
              lineColor: [0, 0, 0],
              textColor: [255, 255, 255],
              halign: "center",
            },
            colSpan: 3,
          },
        ],
        [
          {
            content: "Nombre del paciente:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Fecha de creación:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Identificación:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: patient?.name || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: new Date(patient?.createdAt).toLocaleDateString() || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: patient?.identification || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Teléfono:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Edad:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Dirección:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: patient?.phone || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: patient?.age || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: patient?.address || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Fecha de Nacimiento:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Sexo:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Estado Civil:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: new Date(patient?.birthday).toLocaleDateString() || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content:
              patient?.typeSex === "c2594acf-bb7c-49d0-9506-f556179670ab"
                ? "Femenino"
                : "Masculino",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },

          {
            content: patient?.civilStatus?.name || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Persona de Contacto:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Teléfono de Contacto:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Número de Consultas:",
            styles: {
              fontStyle: "bold",
              fontSize: 15,
              fillColor: [200, 200, 200],
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: patient?.contactPerson || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: patient?.contactPhone || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: patient?.consultCount || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
      theme: "grid",
      styles: {
        font: "helvetica", // Puedes ajustar el tipo de fuente si lo necesitas

        cellPadding: 4, // Espaciado dentro de las celdas
      },
      margin: { top: 55, left: 20, right: 20 }, // Márgenes para centrar la tabla en la página
      tableWidth: "auto", // Esto asegura que la tabla se ajuste bien al tamaño de la página
    });

    const fileName = patient?.name
      ? `Ficha_del_Paciente_${patient.name}.pdf`
      : "Ficha_del_Paciente_.pdf";

    doc.save(fileName);
  };

  return (
    <div className="flex flex-row gap-2 items-center justify-center h-full w-full">
      <Dropdown backdrop="blur" className="rounded-md">
        <DropdownTrigger>
          <Button
            isLoading={statusDeletePatient === "pending"}
            size="sm"
            isIconOnly
            variant="light"
          >
            <FaEllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            showDivider
            startContent={<FaIdCard />}
            key="edit"
            onClick={handleGenerateFicha}
          >
            Generar Ficha del Paciente
          </DropdownItem>
          <DropdownItem
            startContent={<SiFiles />}
            key="consult"
            onClick={() => navigate("/files/patient/" + id)}
          >
            Ver Expediente
          </DropdownItem>
          <DropdownItem
            showDivider
            startContent={<MdEdit />}
            key="edit"
            onClick={handleUpdate}
          >
            Editar
          </DropdownItem>
          <DropdownItem
            className="text-danger"
            color="danger"
            key="edit"
            startContent={<MdDelete />}
            onClick={handleDelete}
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
