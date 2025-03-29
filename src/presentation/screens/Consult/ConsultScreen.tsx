import { useNavigate, useParams } from "react-router-dom";
import { BaseScreen } from "../BaseScreen";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Input, User } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { IPatient } from "../../../interfaces/patient.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useGetConsultByPatientId } from "../Files/query/consult.query";
import { useEffect, useMemo } from "react";
import moment from "moment/min/moment-with-locales";
import { ActionConsult } from "./components/ActionConsult";
import { useState } from "react";
import { MODEFORMENUM } from "../../../enum/mode/mode.enum";
import { BaseModal } from "../../components/Base/BaseModal";
import { FormConsult } from "../Files/components/FormConsult";
import { useConsutlFormStore } from "../../storage/form.storage";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { useGetAllUsers } from "../Users/query/user.query";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

import img from "../Customer/receta medica.jpg";

export function ConsultScreen() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const clientQuery = useQueryClient();
  const [searchByWord, setSearchByWord] = useState<string | undefined>();
  const [idConsulta, setIdConsulta] = useState<string | undefined>();

  // Función que maneja el cambio de ID
  const handleRowClick = (params: any) => {
    const id = params.id.toString();
    setIdConsulta(id); // Actualiza el estado del id
  };

  const columns: GridColDef[] = [
    { field: "colId", headerName: "Código", width: 90 },
    {
      field: "col1",
      headerName: "Motivo",
      flex: 1,
    },
    {
      field: "col2",
      headerName: "Registrado por",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center justify-start w-full h-full">
          <User
            name={params.row.col2.name}
            avatarProps={{
              src: params.row.col2.url,
            }}
          />
        </div>
      ),
    },
    {
      field: "col8",
      headerName: "Fecha de creación",
      flex: 1,
    },
    {
      field: "col7",
      headerName: "Acciones",
      width: 100,
      sortable: false,
      filterable: false,
      pinnable: false,
      renderCell: (params) => {
        // Aquí guardamos el id de cada fila en el estado
        const id = params.id.toString();

        return <ActionConsult id={id} />;
      },
    },
  ];
  if (!patientId) {
    navigate("/");
    return null;
  }

  const {
    modeForm,
    toggleForm: toggleFormConsult,
    showForm,
  } = useConsutlFormStore();

  const patient = (
    clientQuery.getQueryData<IPatient[]>(["getAllPatient"]) ?? []
  ).find((patient) => patient.id === patientId);

  const { data: consultData, isFetching: isLoadingConsult } =
    useGetConsultByPatientId(patientId);

  const rows = useMemo(() => {
    if (!consultData) {
      return [];
    }

    if (searchByWord) {
      return consultData
        .filter(
          (consult) =>
            consult.motive.toLowerCase().includes(searchByWord.toLowerCase()) ||
            consult.id
              .replace(/[^0-9]/g, "")
              .substring(0, 6)
              .toLowerCase()
              .includes(searchByWord.toLowerCase())
        )
        .map((consult) => ({
          colId: consult.id.replace(/[^0-9]/g, "").substring(0, 6),
          id: consult.id,
          col1: consult.motive,
          col2: {
            name: consult.userCreatedBy.name,
            url: consult.userCreatedBy.avatar?.compactUrl,
          },
          col8: moment(consult.createdAt).locale("es").format("L"),
        }));
    }

    return consultData.map((consult) => ({
      colId: consult.id.replace(/[^0-9]/g, "").substring(0, 6),
      id: consult.id,
      col1: consult.motive,
      col2: {
        name: consult.userCreatedBy.name,
        url: consult.userCreatedBy.avatar?.compactUrl,
      },
      col8: moment(consult.createdAt).locale("es").format("L"),
    }));
  }, [consultData, searchByWord, idConsulta]);

  // console.log(consultData);
  useEffect(() => {
    if (idConsulta) {
      console.log("ID CONSULTA actualizado: " + idConsulta);
    }
  }, [idConsulta]); // Dependencia para que se actualice solo cuando cambie el id

  function generateConsultationPDF(consultations: any[]) {
    const doc = new jsPDF();

    const clinicaData = localStorage.getItem("clinicaData");

    if (clinicaData) {
      // Convierte el string a un objeto si la data fue almacenada como JSON
      const parsedData = JSON.parse(clinicaData);
      console.log(parsedData);
      doc.addImage(
        parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
        "JPEG", // Formato de la imagen
        0, // Posición X
        0, // Posición Y
        50, // Ancho
        50 // Alto
      );
      // // Agregar los textos

      doc.setFont("helvetica", "bold");
      doc.text(`Clínica ${parsedData.nombre}`, 42, 15);
      doc.setFontSize(9);
      doc.text(`COD Clínica: ${parsedData.codigo}`, 150, 15);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setFont("helvetica", "bold");
      doc.text("Direccion:", 42, 21);
      doc.setFont("helvetica", "normal");
      doc.text(parsedData.direccion, 70, 21);
      const texto =
        "Atención personalizada para el diagnóstico, tratamiento y seguimiento de enfermedades comunes, infecciones, dolencias y problemas de salud generales.";

      const maxCaracteresPorLinea = 60; // Máximo de caracteres antes del salto
      const lineas = []; // Array para almacenar las líneas

      // Dividir el texto en partes de máximo 52 caracteres
      for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
        lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
      }

      // Imprimir cada línea en una posición diferente en Y
      let y = 27; // Posición inicial en el eje Y
      lineas.forEach((linea) => {
        doc.text(linea, 42, y);
        y += 6; // Incrementar Y para la siguiente línea
      });
      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text("Teléfono:", 8, 170);
      doc.setFont("helvetica", "normal"); // Volver a fuente normal
      doc.text(parsedData.telefono, 34, 170); // Ajustar la posición para que quede al lado

      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text("Horario Atención:", 120, 170);
      doc.setFont("helvetica", "normal"); // Volver a fuente normal
      doc.text(parsedData.horario, 170, 170); // Ajustar la posición para que quede alineado
    } else {
      console.log("No se encontró información en localStorage");
    }

    console.log(consultations[0].patient.name);

    let id = consultations[0].patient.id;

    // Eliminar letras y símbolos, quedándonos solo con los números
    let numbersOnly = id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

    // Obtener solo los primeros 6 números
    let firstSixNumbers = numbersOnly.substring(0, 6);

    // Concatenar con el texto
    doc.setFont("helvetica", "bold");
    doc.text(`Código Expediente: ${firstSixNumbers}`, 8, 57);
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
            content: consultations[0].patient?.name || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content:
              new Date(
                consultations[0].patient?.createdAt
              ).toLocaleDateString() || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consultations[0].patient?.identification || "N/A",
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
            content: consultations[0].patient?.phone || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consultations[0].patient?.age || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consultations[0].patient?.address || "N/A",
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
            content:
              new Date(
                consultations[0].patient?.birthday
              ).toLocaleDateString() || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content:
              consultations[0].patient?.typeSex ===
              "c2594acf-bb7c-49d0-9506-f556179670ab"
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
            content: consultations[0].patient?.civilStatus?.name || "Soltero",
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
            content: consultations[0].patient?.contactPerson || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consultations[0].patient?.contactPhone || "N/A",
            styles: {
              lineColor: [0, 0, 0],
              fontSize: 15,
              halign: "center",
              textColor: [0, 0, 0],
            },
          },
          {
            content: consultations[0].patient?.consultCount || "N/A",
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

        cellPadding: 2, // Espaciado dentro de las celdas
      },
      margin: { top: 60, left: 5, right: 5 }, // Márgenes para centrar la tabla en la página
      tableWidth: "auto", // Esto asegura que la tabla se ajuste bien al tamaño de la página
    });

    doc.addPage();

    consultations.forEach((consult, index) => {
      if (index > 0) doc.addPage(); // Añadir una nueva página para cada consulta

      // doc.addImage(
      //   "https://dl.dropboxusercontent.com/scl/fi/1dkv94n2vwvnjmpd03yj8/e2ed39fa-ed26-44c4-955d-11ce1231afc8.jpeg?rlkey=syzmyq0gi6fbc90oy5ttrx2qt&dl=0",
      //   "JPEG",
      //   10,
      //   10,
      //   10,
      //   10
      // );

      // doc.setFontSize(6);
      // doc.text("Hola", 20, 15);
      // doc.text("Adios", 20, 20);
      // doc.text("xdxdxdxd", 20, 25);
      if (clinicaData) {
        // Convierte el string a un objeto si la data fue almacenada como JSON
        const parsedData = JSON.parse(clinicaData);
        console.log(parsedData);
        doc.addImage(
          parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
          "JPEG", // Formato de la imagen
          0, // Posición X
          0, // Posición Y
          50, // Ancho
          50 // Alto
        );
        // // Agregar los textos

        doc.setFont("helvetica", "bold");
        doc.text(`Clinica ${parsedData.nombre}`, 42, 15);
        doc.setFontSize(9);
        doc.text(`COD Clínica: ${parsedData.codigo}`, 150, 15);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setFont("helvetica", "bold");
        doc.text("Direccion:", 42, 21);
        doc.setFont("helvetica", "normal");
        doc.text(parsedData.direccion, 70, 21);
        const texto =
          "Atención personalizada para el diagnóstico, tratamiento y seguimiento de enfermedades comunes, infecciones, dolencias y problemas de salud generales.";

        const maxCaracteresPorLinea = 60; // Máximo de caracteres antes del salto
        const lineas = []; // Array para almacenar las líneas

        // Dividir el texto en partes de máximo 52 caracteres
        for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
          lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
        }

        // Imprimir cada línea en una posición diferente en Y
        let y = 27; // Posición inicial en el eje Y
        lineas.forEach((linea) => {
          doc.text(linea, 42, y);
          y += 6; // Incrementar Y para la siguiente línea
        });
        // doc.setFont("helvetica", "bold"); // Poner en negrita
        // doc.text("Teléfono:", 15, 290);
        // doc.setFont("helvetica", "normal"); // Volver a fuente normal
        // doc.text(parsedData.telefono, 40, 290); // Ajustar la posición para que quede al lado

        // doc.setFont("helvetica", "bold"); // Poner en negrita
        // doc.text("Horario Atención:", 110, 290);
        // doc.setFont("helvetica", "normal"); // Volver a fuente normal
        // doc.text(parsedData.horario, 160, 290); // Ajustar la posición para que quede alineado
      } else {
        console.log("No se encontró información en localStorage");
      }
      let id = consult.id;

      // Eliminar letras y símbolos, quedándonos solo con los números
      let numbersOnly = id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

      // Obtener solo los primeros 6 números
      let firstSixNumbers = numbersOnly.substring(0, 6);

      // Concatenar con el texto
      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text(`Código Consulta: ${firstSixNumbers}`, 15, 63);
      doc.setFont("helvetica", "normal"); // Poner en negrita

      let currentY = 65;

      autoTable(doc, {
        startY: currentY, // Comienza la tabla después de los saltos de línea
        body: [
          [
            {
              content: "Consulta Médica",
              styles: {
                fontStyle: "bold",
                fontSize: 14,
                fillColor: [0, 76, 153],
                lineColor: [0, 0, 0],
                textColor: [255, 255, 255],
                halign: "center",
              },
              colSpan: 4,
            },
          ],
          [
            {
              content: "Nombre del paciente:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: "Fecha consulta:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.patient?.name || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content:
                new Date(consult.createdAt).toLocaleDateString() || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          // Segunda fila que se ve como encabezado
          [
            {
              content: "Motivo:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: "Peso:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: "Tamaño:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: "Pulso",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
          ],
          [
            {
              content: consult.motive || "N/A",
              colSpan: 1,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.weight ? `${consult.weight} kg` : "N/A",
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: consult.size ? `${consult.size} cm` : "N/A",
              colSpan: 1,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.pulse ? `${consult.pulse} Lpm` : "N/A",
              colSpan: 1,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          [
            {
              content: "Historial clínico:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: "Saturacion de Oxígeno:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content: "Presión Arterial:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.clinicalhistory || "N/A",
              colSpan: 1,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.oxygenSaturation
                ? `${consult.oxygenSaturation}%`
                : "N/A",
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
              colSpan: 1,
            },
            {
              content:
                consult.systolicPressure && consult.diastolicPressure
                  ? `${consult.systolicPressure}/${consult.diastolicPressure} mmHg`
                  : "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
        ],
        theme: "grid",
      });

      autoTable(doc, {
        // startY: finalY + 20,
        body: [
          [
            {
              content: "Evaluación Geriátrica",
              styles: {
                fontStyle: "bold",
                fontSize: 14,
                fillColor: [0, 76, 153],
                lineColor: [0, 0, 0],
                textColor: [255, 255, 255],
                halign: "center",
              },
              colSpan: 4,
            },
          ],
          [
            {
              content: "Evaluacion Biologica",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: "Evalución Psicologica:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.bilogicalEvaluation || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.psychologicalEvaluation || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          [
            {
              content: "Evaluación Social",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: "Evaluación Funcional:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.socialEvaluation || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.functionalEvaluation || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
        ],
        theme: "grid",
      });

      autoTable(doc, {
        // startY: finalY2 + 20,
        body: [
          [
            {
              content: "Resultados y Diagnósticos",
              styles: {
                fontStyle: "bold",
                fontSize: 14,
                fillColor: [0, 76, 153],
                lineColor: [0, 0, 0],
                textColor: [255, 255, 255],
                halign: "center",
              },
              colSpan: 4,
            },
          ],
          [
            {
              content: "Examen Complementario:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: consult.complementaryTest?.name || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          [
            {
              content: "Diagnóstico:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: "Receta:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.diagnosis || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: consult.recipe || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          [
            {
              content: "Registrado por:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
            {
              content: "Proxima Cita:",
              styles: {
                fontStyle: "bold",
                fillColor: [200, 200, 200],
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              colSpan: 2,
            },
          ],
          [
            {
              content: consult.userCreatedBy?.name || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
            {
              content: formateDate(consult.nextappointment) || "N/A",
              colSpan: 2,
              styles: {
                lineColor: [0, 0, 0],
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
        ],
        theme: "grid",
      });
      const finalY = (doc as any).lastAutoTable?.finalY || 10;
      const textt = "___________________";
      const textWidthh = doc.getTextWidth(textt); // Corrige la variable usada
      const pageWidthh = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página

      doc.setFont("helvetica", "bold");
      doc.text(textt, (pageWidthh - textWidthh) / 2, finalY + 10); // Coloca el texto debajo de la primera tabla
      const texttt = "Firma Médico";
      const textWidthhh = doc.getTextWidth(textt); // Corrige la variable usada
      const pageWidthhh = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página

      doc.setFont("helvetica", "bold");
      // Nueva posición más a la derecha
      const offsetX = 10; // Ajusta este valor según lo que necesites
      doc.text(texttt, (pageWidthhh - textWidthhh) / 2 + offsetX, finalY + 18);

      //encabezado de pagina
      // doc.addImage(
      //   "https://dl.dropboxusercontent.com/scl/fi/1dkv94n2vwvnjmpd03yj8/e2ed39fa-ed26-44c4-955d-11ce1231afc8.jpeg?rlkey=syzmyq0gi6fbc90oy5ttrx2qt&dl=0",
      //   "JPEG",
      //   10,
      //   10,
      //   10,
      //   10
      // );
      //pagina de imagen examen complementario
      if (consult.image) {
        if (consult.image.originalUrl) {
          doc.addPage();
          doc.addImage(
            consult.image.originalUrl,
            "JPEG",
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height
          );
        }
      }

      //receta medica
      doc.addPage();
      // Cargar la imagen (en este caso, la imagen se carga desde una URL)
      const imgPath = img; // Cambia esto por la ruta de tu imagen

      // Agregar la imagen al PDF como fondo (ajustar al tamaño de la página)
      doc.addImage(
        imgPath,
        "JPEG",
        0,
        0,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height
      );

      // Ahora puedes agregar más contenido encima de la imagen, por ejemplo, texto:
      doc.setFontSize(12);
      doc.text(consult.patient?.name || "N/A", 60, 60);
      doc.text(consult.createdAt.split("T")[0] || "N/A", 155, 60);
      doc.text(
        calculateAge(consult.patient?.birthday || "N/A").toString(),
        40,
        72
      );
      doc.text(
        consult.patient?.typeSex === "c2594acf-bb7c-49d0-9506-f556179670ab"
          ? "Femeninio"
          : "Masculino",
        94,
        72
      );
      doc.text(consult.weight ? `${consult.weight} kg` : "N/A", 160, 72);
      doc.text(consult.diagnosis || "N/A", 50, 84);
      // const texto = consult.recipe || "N/A";
      // const maxCaracteresPorLinea = 70; // Máximo de caracteres antes del salto
      // const lineas = []; // Array para almacenar las líneas

      // // Dividir el texto en partes de máximo 80 caracteres
      // for (let i = 0; i < texto.length; i += maxCaracteresPorLinea) {
      //   lineas.push(texto.substring(i, i + maxCaracteresPorLinea).trim());
      // }

      // // Imprimir cada línea en una posición diferente en Y
      // let y = 110; // Posición inicial en el eje Y
      // lineas.forEach((linea) => {
      //   doc.text(linea, 20, y);
      //   y += 8; // Incrementar Y para la siguiente línea
      // });

      const texto: string = consult.recipe || "N/A";
      const maxCaracteresPorLinea: number = 70; // Máximo de caracteres antes del salto de línea
      const lineas: string[] = []; // Especificamos que es un array de strings
      const yInicial: number = 110; // Posición inicial en Y
      let y: number = yInicial;

      // Primero, dividir por saltos de línea existentes (\n)
      const partes: string[] = texto.split("\n");

      partes.forEach((parte: string) => {
        // Dividir cada parte en fragmentos de máximo 'maxCaracteresPorLinea' caracteres
        for (let i = 0; i < parte.length; i += maxCaracteresPorLinea) {
          lineas.push(parte.substring(i, i + maxCaracteresPorLinea).trim());
        }
        // Agregar un espacio extra en Y para respetar los saltos de línea originales
        lineas.push("");
      });

      // Imprimir cada línea en una posición diferente en Y
      lineas.forEach((linea: string) => {
        doc.text(linea, 20, y);
        y += 4; // Espacio normal entre líneas
      });

      doc.text(consult.userCreatedBy?.name || "N/A", 140, 270);
      doc.text(formateDate(consult.nextappointment) || "N/A", 27, 257);

      let numbersOnlyy = consult.id.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número

      // Obtener solo los primeros 6 números
      let firstSixNumberss = numbersOnlyy.substring(6, 12);

      doc.setFont("helvetica", "bold"); // Poner en negrita
      doc.text(`Código Receta: ${firstSixNumberss}`, 1, 296);
      doc.setFont("helvetica", "normal"); // Poner en negrita

      if (clinicaData) {
        // Convierte el string a un objeto si la data fue almacenada como JSON
        const parsedData = JSON.parse(clinicaData);
        console.log(parsedData);
        doc.addImage(
          parsedData.imagen, // Ruta de la imagen o URL de la imagen en lise,
          "JPEG", // Formato de la imagen
          0, // Posición X
          3, // Posición Y
          13, // Ancho
          13 // Altos
        );
        // // Agregar los textos

        doc.setFont("helvetica", "bold");
        doc.text(`Clinica ${parsedData.nombre}`, 80, 15);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "bold");
        doc.text(parsedData.direccion, 67, 21);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "bold"); // Poner en negrita
        doc.text(parsedData.telefono, 90, 295); // Ajustar la posición para que quede al lado
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "bold"); // Poner en negrita
        doc.text("Horario Atención:", 70, 27);
        doc.setFont("helvetica", "normal"); // Volver a fuente normal
        doc.text(parsedData.horario, 106, 27); // Ajustar la posición para que quede alineado
      } else {
        console.log("No se encontró información en localStorage");
      }

      // doc.setFontSize(6);
      // doc.text("Hola", 20, 15);
      // doc.text("Adios", 20, 20);
      // doc.text("xdxdxdxd", 20, 25);

      //imagen examen complementario
    });

    // Guardar el PDF con el nombre del paciente o un nombre genérico si es null
    const fileName = patient?.name
      ? `Expediente_Clinico_${patient?.name}.pdf`
      : "Expediente_Clinico.pdf";

    // Guardar el archivo
    doc.save(fileName);
  }

  const formateDate = (date: string) => {
    let dateString = date || "N/A"; // Si no existe el valor, se usará "N/A"

    if (dateString !== "N/A") {
      // Reemplazar "T" por espacio y eliminar la "Z"
      dateString = dateString.replace("T", " ").replace("Z", "");

      // Dividir la fecha en parte de fecha y hora
      let [datePart, timePart] = dateString.split(" ");

      // Extraer la hora, los minutos y los segundos
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Restar 6 horas
      hours -= 6;

      // Si las horas quedan por debajo de 0 (es decir, resta de un día anterior), ajustamos
      if (hours < 0) {
        hours += 24; // Sumar 24 horas si queda negativo
        // Ajustar el día, para eso usamos el objeto Date
        let date = new Date(datePart); // Crear un objeto Date solo con la parte de la fecha
        date.setDate(date.getDate() - 1); // Restamos un día
        datePart = date.toISOString().split("T")[0]; // Formateamos solo la fecha (YYYY-MM-DD)
      }

      // Formatear la nueva hora con los minutos y segundos
      let newTimePart = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Crear la nueva fecha con la hora ajustada
      var formattedDate = `${datePart} ${newTimePart}`;
      return formattedDate;

      // Mostrar el resultado en el documento
    }
  };

  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday); // Convierte la fecha de string a Date
    const today = new Date(); // Fecha actual

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajusta la edad si el cumpleaños aún no ha ocurrido este año
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <>
      <BaseScreen
        isLoading={isLoadingConsult}
        showBackButton
        titlePage={`Consultas de ${patient?.name}`}
        actions={
          <>
            <Button
              onClick={() => generateConsultationPDF(consultData || [])}
              startContent={<VscFileSymlinkDirectory />}
              color="primary"
            >
              Exportar Expediente
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 flex-1">
          <Input
            label=""
            placeholder="Buscar Consulta..."
            variant="bordered"
            startContent={<CiSearch />}
            className="max-w-sm"
            onChange={(e) => setSearchByWord(e.target.value)}
          />
          <div className="flex-1 overflow-auto">
            <DataGrid
              onRowClick={handleRowClick}
              columns={columns}
              rows={rows}
              disableColumnMenu
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </div>
        </div>
      </BaseScreen>
      <BaseModal
        size="full"
        scrollBehavior="inside"
        isOpen={showForm}
        onOpenChange={toggleFormConsult}
        title={
          modeForm === MODEFORMENUM.CREATE
            ? "Nueva Consulta"
            : "Editar Consulta"
        }
      >
        <FormConsult id={idConsulta ?? ""} />
      </BaseModal>
    </>
  );
}
//xdxd
