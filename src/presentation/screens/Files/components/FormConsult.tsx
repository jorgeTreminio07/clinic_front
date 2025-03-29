import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Button,
  DatePicker,
  Divider,
  Input,
  RangeValue,
  DateValue,
  Textarea,
} from "@nextui-org/react";
import { useGetAllPatient } from "../query/patient.query";
import { useGetExam } from "../query/exam.query";
import { FaFileImage } from "react-icons/fa6";
import { useFilePicker } from "use-file-picker";
import { useFormikConsult } from "../hooks/useFormilConsult";
import { parseAbsoluteToLocal } from "@internationalized/date";
import moment from "moment";
import { useEffect, useState } from "react";
import { useConsutlFormStore } from "../../../storage/form.storage";
import { FileUtils } from "../../../../utils/file.utils";
import { MODEFORMENUM } from "../../../../enum/mode/mode.enum";
import toast from "react-hot-toast";
import { useGetRecentConsults } from "../../Reports/query/consult.query";

interface IProps {
  id: string;
}
export function FormConsult({ id }: IProps) {
  const [rangeDate, setRangeDate] = useState<RangeValue<DateValue>>();
  const { data: allPatient, status: statusGetAllPatient } = useGetAllPatient();
  const { data: allExamns, status: statusGetAllExam } = useGetExam();
  const { data: dataConsult, refetch: handleGetConsult } = useGetRecentConsults(
    rangeDate
      ? {
          startDate: moment(rangeDate.start.toString()).format("l"),
          endDate: moment(rangeDate.end.toString()).format("l"),
        }
      : undefined
  );

  const toggleForm = useConsutlFormStore((state) => state.toggleForm);
  const modeForm = useConsutlFormStore((state) => state.modeForm);
  const {
    values,
    errors,
    setFieldValue,
    handleSubmit,
    addConsultStatus,
    updateConsultStatus,
  } = useFormikConsult();

  const { openFilePicker, plainFiles, loading, clear } = useFilePicker({
    accept: ".png, .jpg, .jpeg",
    multiple: false,
  });

  const isLoading =
    statusGetAllPatient === "pending" || statusGetAllExam === "pending";

  const isLoadingUpdateConsult = updateConsultStatus === "pending";
  const isLoadingAddConsult = addConsultStatus === "pending";

  const [noExam, setNoExam] = useState(true);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (addConsultStatus === "success" || updateConsultStatus === "success") {
      toggleForm();
    }
    if (
      modeForm === MODEFORMENUM.UPDATE &&
      values.examComplementary !== undefined
    ) {
      setNoExam(false);
    }
    getDataconsult();
    // console.log(dataConsult);
    // console.log(values.nextappointment);
    // console.log(values.examComplementary);
    // console.log(values.image);

    if (plainFiles.length > 0) {
      (async () => {
        setFieldValue(
          "imageExam",
          await FileUtils.convertFileToBase64(plainFiles[0])
        );
        setFileName(plainFiles[0]?.name || "");
      })();
    }
    // if (modeForm === MODEFORMENUM.UPDATE && values.patient) {
    //   const selectedPatient = allPatient?.find((p) => p.id === values.patient);
    //   if (selectedPatient && inputValue !== selectedPatient.name) {
    //     setInputValue(selectedPatient.name); // Solo actualiza si es diferente
    //   }
    // }
    console.log("id desde consult: " + id);
  }, [
    addConsultStatus,
    updateConsultStatus,
    plainFiles,
    modeForm,
    // values.patient,
    // allPatient,
  ]);

  const getDataconsult = async () => {
    await handleGetConsult();
  };

  const handleSubmitForm = () => {
    if (values.nextappointment) {
      const isFalse = validateNextAppointment(
        dataConsult,
        {
          nextappointment: values.nextappointment,
          id: id || "",
        },
        modeForm
      );

      if (isFalse === false) {
        return;
      }
    } else {
      console.error("El valor de nextappointment es undefined.");
    }
    // Verifica si hay un examen complementario seleccionado pero no hay imagen
    if (values.examComplementary && !plainFiles[0]?.name) {
      if (modeForm === MODEFORMENUM.CREATE) {
        // Muestra la advertencia para que el usuario suba una imagen
        toast.error("Debe subir una imagen del examen", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        handleSubmit();
      }
    } else if (values.examComplementary && modeForm === MODEFORMENUM.UPDATE) {
      handleSubmit();
    } else if (values.examComplementary === null) {
      setFieldValue("examComplementary", undefined);
      handleSubmit();
    } else {
      // Si la imagen está presente o no hay examen complementario, procede con el guardado
      handleSubmit();
    }
  };

  function validateNextAppointment(
    dataConsult: { nextappointment: string; id: string }[],
    values: { nextappointment: string; id: string },
    formMode: MODEFORMENUM
  ): boolean {
    const newDate = new Date(values.nextappointment); // Convierte la fecha a tipo Date

    for (const consult of dataConsult) {
      const existingDate = new Date(consult.nextappointment); // Convierte la fecha a tipo Date

      // Comparar si la fecha y la hora exacta coinciden
      if (newDate.getTime() === existingDate.getTime()) {
        if (formMode === MODEFORMENUM.UPDATE && consult.id === values.id) {
          continue;
        } else {
          toast.error("Esta fecha y hora están ocupadas.", {
            position: "top-right",
            duration: 3000,
          });
          console.log(formMode);
          console.log(existingDate + " --- " + newDate);
          console.log(consult.id + " --- " + values.id);
          return false;
        }
      }

      // Comparar si la fecha coincide y la hora está dentro de los 29 minutos
      if (newDate.toDateString() === existingDate.toDateString()) {
        const diffMilliseconds: number =
          newDate.getTime() - existingDate.getTime();
        const diffMinutes: number = Math.abs(diffMilliseconds / (1000 * 60)); // Diferencia en minutos

        if (diffMinutes < 30) {
          toast.error(
            "La Agenda está ocupada, debe elegir una hora con al menos 30 minutos de diferencia.",
            { position: "top-right", duration: 4000 }
          );
          return false;
        }
      }
    }

    return true; // Si pasa todas las validaciones
  }

  // Ejemplo de uso
  // const dataConsult = [
  //   { nextappointment: "2025-03-22T09:00:00.000Z" }, // Cita existente
  //   { nextappointment: "2025-03-22T10:00:00.000Z" }, // Otra cita existente
  // ];

  // const values = { nextappointment: "2025-03-22T09:15:00.000Z" }; // Nueva cita (debe fallar)

  // const isValid = validateNextAppointment(dataConsult, values);
  // console.log(isValid); // false, mostrará alerta

  interface Group {
    id: string;
    name: string;
  }

  interface Exam {
    id: string;
    name: string;
    group: Group;
  }

  interface GroupedExam {
    idGroup: string;
    nameGroup: string;
    exams: {
      idExam: string;
      nameExam: string;
    }[];
  }

  const groupedExams: GroupedExam[] = [];

  if (allExamns && allExamns.length > 0) {
    allExamns.forEach((exam: Exam) => {
      const { id: examId, name: examName, group } = exam;
      const { id: groupId, name: groupName } = group;

      let groupFound = groupedExams.find((g) => g.idGroup === groupId);

      if (!groupFound) {
        groupFound = {
          idGroup: groupId,
          nameGroup: groupName,
          exams: [],
        };
        groupedExams.push(groupFound);
      }

      groupFound.exams.push({
        idExam: examId,
        nameExam: examName,
      });
    });
  }

  const [inputValue, setInputValue] = useState("");

  // console.log(groupedExams);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col gap-4 w-10/12">
        <h1 className="text-2xl font-semibold">Consulta Médica</h1>
        <Divider />
        <Autocomplete
          isDisabled={modeForm === MODEFORMENUM.UPDATE}
          isLoading={isLoading}
          isRequired
          defaultItems={allPatient ?? []}
          label="Paciente"
          size="sm"
          isInvalid={!!errors.patient}
          errorMessage={errors.patient}
          selectedKey={values.patient}
          inputValue={inputValue}
          onInputChange={(value) => setInputValue(value)} // Permite escribir manualmente
          onSelectionChange={(e) => {
            const selectedPatient = allPatient?.find((p) => p.id === e);
            if (selectedPatient) {
              setFieldValue("patient", e); // Guarda el ID del paciente
              setInputValue(selectedPatient.name); // Muestra solo el nombre en el input
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>
              {item.id.replace(/[^0-9]/g, "").substring(0, 6) +
                " - " +
                item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* <Autocomplete
          isLoading={isLoading}
          isRequired
          defaultItems={allPatient ?? []}
          label="Paciente"
          size="sm"
          isInvalid={!!errors.patient}
          errorMessage={errors.patient}
          selectedKey={values.patient}
          onSelectionChange={(e) => setFieldValue("patient", e)}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>
              {" "}
              {item.id.replace(/[^0-9]/g, "").substring(0, 6) +
                " - " +
                item.name}
            </AutocompleteItem>
          )}
        </Autocomplete> */}
        <div className="flex flex-row gap-4">
          <Textarea
            value={values.motive}
            errorMessage={errors.motive}
            isInvalid={!!errors.motive}
            onChange={(e) => setFieldValue("motive", e.target.value)}
            isRequired
            label="Motivo"
          />
          <Textarea
            isInvalid={!!errors.clinicalhistory}
            errorMessage={errors.clinicalhistory}
            onChange={(e) => setFieldValue("clinicalhistory", e.target.value)}
            label="Historial clínico"
            value={values.clinicalhistory}
          />
        </div>
        <Divider />
        <h1 className="text-2xl font-semibold">Evaluacion Geriatrica</h1>
        <div className="flex flex-row gap-4">
          <Textarea
            isInvalid={!!errors.bilogicalEvaluation}
            errorMessage={errors.bilogicalEvaluation}
            onChange={(e) =>
              setFieldValue("bilogicalEvaluation", e.target.value)
            }
            label="Biológico"
            value={values.bilogicalEvaluation}
          />
          <Textarea
            isInvalid={!!errors.psychologicalEvaluation}
            errorMessage={errors.psychologicalEvaluation}
            onChange={(e) =>
              setFieldValue("psychologicalEvaluation", e.target.value)
            }
            label="Psicológico"
            value={values.psychologicalEvaluation}
          />
          <Textarea
            isInvalid={!!errors.socialEvaluation}
            errorMessage={errors.socialEvaluation}
            onChange={(e) => setFieldValue("socialEvaluation", e.target.value)}
            label="Social"
            value={values.socialEvaluation}
          />
          <Textarea
            isInvalid={!!errors.functionalEvaluation}
            errorMessage={errors.functionalEvaluation}
            onChange={(e) =>
              setFieldValue("functionalEvaluation", e.target.value)
            }
            label="Funcional"
            value={values.functionalEvaluation}
          />
        </div>
        <div className="flex flex-row gap-4">
          <Input
            isInvalid={!!errors.weight}
            errorMessage={errors.weight}
            isRequired
            size="sm"
            label="Peso"
            endContent="Lb"
            value={values.weight?.toString()}
            onChange={(e) =>
              setFieldValue("weight", e.target.value.replace(",", "."))
            }
          />
          <Input
            isInvalid={!!errors.size}
            errorMessage={errors.size}
            isRequired
            size="sm"
            label="Estatura"
            endContent="Cm"
            value={values.size?.toString()}
            onChange={(e) =>
              setFieldValue("size", e.target.value.replace(",", "."))
            }
          />
          <Input
            isInvalid={!!errors.pulse}
            errorMessage={errors.pulse}
            onChange={(e) => setFieldValue("pulse", e.target.value)}
            size="sm"
            label="Pulso"
            endContent="Lpm"
            value={values.pulse?.toString()}
          />
          <Input
            isInvalid={!!errors.oxygenSaturation}
            errorMessage={errors.oxygenSaturation}
            onChange={(e) =>
              setFieldValue(
                "oxygenSaturation",
                e.target.value.replace(",", ".")
              )
            }
            size="sm"
            label="Saturación de oxigeno"
            endContent="%"
            value={values.oxygenSaturation?.toString()}
          />
        </div>
        <div className="flex flex-col">
          <h1>Presión arterial</h1>
          <div className="flex flex-row w-1/3 gap-4">
            <Input
              isInvalid={!!errors.systolicPressure}
              errorMessage={errors.systolicPressure}
              onChange={(e) =>
                setFieldValue(
                  "systolicPressure",
                  e.target.value.replace(",", ".")
                )
              }
              size="sm"
              label="Sistólica"
              endContent="mmHG"
              value={values.systolicPressure?.toString()}
            />
            {/* <Button variant="light">/</Button> */}
            <Input
              isInvalid={!!errors.diastolicPressure}
              errorMessage={errors.diastolicPressure}
              onChange={(e) =>
                setFieldValue(
                  "diastolicPressure",
                  e.target.value.replace(",", ".")
                )
              }
              size="sm"
              label="Diastólica"
              endContent="mmHG"
              value={values.diastolicPressure?.toString()}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <Textarea
            isRequired
            isInvalid={!!errors.antecedentPerson}
            errorMessage={errors.antecedentPerson}
            value={values.antecedentPerson}
            onChange={(e) => setFieldValue("antecedentPerson", e.target.value)}
            label="Antecendentes Personales"
          />
          <Textarea
            isInvalid={!!errors.antecedentFamily}
            errorMessage={errors.antecedentFamily}
            onChange={(e) => setFieldValue("antecedentFamily", e.target.value)}
            label="Antecendentes Familiares"
            value={values.antecedentFamily}
          />
        </div>
        <div className="flex flex-row gap-4">
          {/* <Autocomplete
            isLoading={isLoading}
            defaultItems={allExamns ?? []}
            label="Examen complementario"
            size="sm"
            onSelectionChange={(e) => {
              setFieldValue("examComplementary", e);
              console.log(e);
              // Cambiar el valor de noExam dependiendo de si se seleccionó un examen
              setNoExam(e ? false : true); // Si hay un valor seleccionado, noExam será false, sino será true
            }}
            defaultSelectedKey={values.examComplementary}
          >
            {(item) => (
              <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete> */}
          <Autocomplete
            isLoading={isLoading}
            defaultItems={groupedExams ?? []}
            label="Examen complementario"
            size="sm"
            onSelectionChange={(e) => {
              setFieldValue("examComplementary", e);
              // console.log(e);
              setNoExam(e ? false : true);
            }}
            defaultSelectedKey={values.examComplementary}
            disabledKeys={groupedExams.map((group) => group.idGroup)}
          >
            {groupedExams.map((group) => (
              <>
                <AutocompleteItem
                  key={group.idGroup}
                  isDisabled
                  style={{ color: "white", backgroundColor: "#0460ca" }}
                >
                  {group.nameGroup}
                </AutocompleteItem>
                {group.exams &&
                  group.exams.map((exam) => (
                    <AutocompleteItem key={exam.idExam}>
                      {exam.nameExam}
                    </AutocompleteItem>
                  ))}
              </>
            ))}
          </Autocomplete>

          <Textarea
            isRequired
            label="Diagnóstico"
            isInvalid={!!errors.diagnostic}
            errorMessage={errors.diagnostic}
            value={values.diagnostic}
            onChange={(e) => setFieldValue("diagnostic", e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-4">
          <Button
            variant="flat"
            onPress={openFilePicker}
            isLoading={loading}
            startContent={<FaFileImage />}
            color="primary"
            fullWidth
            isDisabled={noExam}
          >
            {fileName ? fileName : "Imagen del Examen"}
          </Button>
          <DatePicker
            isRequired
            label="Proxima cita"
            showMonthAndYearPickers
            value={
              (values.nextappointment &&
                parseAbsoluteToLocal(values.nextappointment)) ||
              undefined
            }
            isInvalid={!!errors.nextappointment}
            errorMessage={errors.nextappointment}
            onChange={(e) => {
              if (e?.toAbsoluteString) {
                setFieldValue("nextappointment", e?.toAbsoluteString());
              } else {
                setFieldValue(
                  "nextappointment",
                  new Date(e?.toString()!).toISOString()
                );
              }
            }}
            hideTimeZone={true}
            // granularity="day"
          />
        </div>
        <Textarea
          isRequired
          label="Receta"
          isInvalid={!!errors.recipe}
          errorMessage={errors.recipe}
          value={values.recipe}
          onChange={(e) => setFieldValue("recipe", e.target.value)}
        />

        <div className="flex flex-row gap-4 justify-end items-center">
          <Button onClick={() => toggleForm()}>Cancelar</Button>
          <Button
            onClick={() => handleSubmitForm()}
            isLoading={
              isLoading || isLoadingAddConsult || isLoadingUpdateConsult
            }
            //   disabled={isLoadingRoles}
            color="primary"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
