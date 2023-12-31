import { useEffect, useState } from "react";
import ModalRightSide from "../components/ModalRightSide";
import { IoCloseOutline } from "react-icons/io5";
import {
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Tooltip,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { supabase } from "../supabase";
import { KpiName } from "../model/kpi";

export default function AddKpiModalPage({
  isOpen,
  onRequestClose,
  circleId,
  fetchKpiDefinitions,
  setOpenAlert,
  setAlertMessage,
  setSeverity,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  circleId: number;
  fetchKpiDefinitions: () => Promise<void>;
  setOpenAlert: (value: boolean) => void;
  setAlertMessage: (value: string) => void;
  setSeverity: (value: "success" | "error" | "warning" | "info") => void;
}): JSX.Element {
  const [kpiName, setKpiName] = useState("");
  const [description, setDescription] = useState("");
  const [periodicityValue, setPeriodicityValue] = useState("daily");
  const [unitValue, setUnitValue] = useState("numeric");
  const [formulaValue, setFormulaValue] = useState("aggregate");
  const [cumulativeValue, setCumulativeValue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allKpiNames, setAllKpiNames] = useState<KpiName[]>([]);

  const getAllKpiNames = async () => {
    try {
      const { data, error } = await supabase
        .from("kpi_definition")
        .select("kpi_name");
      if (error) throw error;
      if (data) {
        setAllKpiNames(data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllKpiNames();
  }, []);

  const addKpiToCircle = async (kpiId: number) => {
    try {
      const { data, error } = await supabase
        .from("circle_kpi_definition")
        .insert([
          {
            circle_id: circleId,
            kpi_id: kpiId,
          },
        ])
        .select("*");

      if (error) {
        console.log("Error adding new KPI to circle:", error.message);
      }
      if (data) {
        fetchKpiDefinitions();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleCloseModal = () => {
    setKpiName("");
    setDescription("");
    setPeriodicityValue("daily");
    setUnitValue("numeric");
    setFormulaValue("aggregate");
    setCumulativeValue(false);
    setError("");
    onRequestClose();
  };

  const handleAddKpi = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const kpiNameLowerCase = kpiName.toLowerCase();
      const isNameExists = allKpiNames.some(
        (kpi) => kpi.kpi_name.toLowerCase() === kpiNameLowerCase
      );

      if (isNameExists) {
        setError(
          "This KPI's name already exists in the system. Please enter a new KPI name or check the already existing KPI"
        );
      } else {
        const { data, error } = await supabase
          .from("kpi_definition")
          .insert([
            {
              kpi_name: kpiName,
              description: description ? description : null,
              periodicity: periodicityValue,
              unit: unitValue,
              cumulative: cumulativeValue,
              formula: formulaValue,
              active: true,
            },
          ])
          .select("*");

        if (error) {
          console.log("Error adding new KPI:", error.message);
          setError("Error adding new KPI. Please try again.");
        } else if (data) {
          const newKpi = data[0];
          addKpiToCircle(newKpi.kpi_id);
          setOpenAlert(true);
          setAlertMessage("KPI added successfully!");
          setSeverity("success");
          fetchKpiDefinitions();
          handleCloseModal();
          getAllKpiNames();
        }
      }
    } catch (error: any) {
      setSeverity("error");
      setAlertMessage("Error adding new KPI!");
      setOpenAlert(true);
      console.log(error.message);
    }
  };

  const renderAddKpiModal = () => {
    return (
      <div className="mx-4">
        <div
          className="text-xl text-[#414445] float-right cursor-pointer"
          onClick={handleCloseModal}
        >
          <IoCloseOutline />
        </div>
        <div className="text-3xl font-light py-10">Add a new KPI</div>
        <div className="text-2xl font-normal mb-4">Name and Description</div>
        <form onSubmit={handleAddKpi}>
          <div className="flex flex-col items-start gap-2.5 mb-4">
            <label htmlFor="kpi-name" className="text-base font-medium">
              Name of the KPI
            </label>
            <input
              className="grow appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded w-full"
              type="text"
              name="kpi-name"
              placeholder="Write the name of your new KPI"
              value={kpiName}
              onChange={(e) => setKpiName(e.target.value)}
              required
            />
            <div className="text-sm text-red-600">{error}</div>
          </div>
          <div className="flex flex-col items-start gap-2.5 pb-10 border-b border-[#D0D8DB]">
            <label htmlFor="description" className="text-base font-medium">
              Description
            </label>
            <input
              className="grow appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded w-full"
              type="text"
              name="description"
              placeholder="Give a description of the new KPI"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="py-10 border-b border-[#D0D8DB]">
            <div className="text-2xl font-normal mb-4">
              Periodicity - How often do you track this KPI?
            </div>
            <div>
              <Box>
                <FormControl className="w-full">
                  <RadioGroup
                    value={periodicityValue}
                    name="periodicity-group"
                    onChange={(e) => setPeriodicityValue(e.target.value)}
                    row
                    className="flex justify-between"
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Daily"
                      value="daily"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Weekly"
                      value="weekly"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Monthly"
                      value="monthly"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Quarterly"
                      value="quarterly"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Yearly"
                      value="yearly"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="py-10 border-b border-[#D0D8DB]">
            <div className="text-2xl font-normal mb-4">
              Unit - What quantity is your KPI measured in?
            </div>
            <div>
              <Box>
                <FormControl className="w-full">
                  <RadioGroup
                    value={unitValue}
                    name="unit-group"
                    onChange={(e) => setUnitValue(e.target.value)}
                    row
                    className="flex justify-between"
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Count"
                      value="numeric"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="Percentage"
                      value="%"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                        />
                      }
                      label="True/False"
                      value="boolean"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="pt-10">
            <div className="text-2xl font-normal">
              Calculation - How would you like the values of the KPI to be
              calculated over the year?
            </div>
            <div className="text-sm my-3">
              If you're unsure about any options in the form, check for more
              info with each selection.
            </div>
            <div>
              <Box>
                <FormControl className="w-full">
                  <RadioGroup
                    value={formulaValue}
                    name="formula-group"
                    onChange={(e) => setFormulaValue(e.target.value)}
                    row
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center w-[30%] min-w-[240px] ">
                      <FormControlLabel
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                          />
                        }
                        label="As average"
                        value="average"
                      />
                      <Tooltip
                        title={
                          <div className="text-center">
                            The average of all the KPI values for the year.
                          </div>
                        }
                      >
                        <span className="text-[#7C7E7E] text-lg">
                          <HiMiniInformationCircle />
                        </span>
                      </Tooltip>
                    </div>
                    <div className="flex items-center w-[30%] min-w-[240px]">
                      <FormControlLabel
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                          />
                        }
                        label="As total sum"
                        value="aggregate"
                      />
                      <Tooltip
                        title={
                          <div className="text-center">
                            The combined total of all the KPI values for the
                            year.
                          </div>
                        }
                      >
                        <span className="text-[#7C7E7E] text-lg">
                          <HiMiniInformationCircle />
                        </span>
                      </Tooltip>
                    </div>
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="py-10 border-b border-[#D0D8DB]">
            <div className="text-2xl font-normal mb-4">
              Value Type - How would you like the values to be entered?
            </div>
            <div>
              <Box>
                <FormControl className="flex w-full">
                  <RadioGroup
                    value={cumulativeValue}
                    name="cumulative-group"
                    onChange={(e) =>
                      setCumulativeValue(e.target.value === "true")
                    }
                    row
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center w-[30%] min-w-[240px]">
                      <FormControlLabel
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                          />
                        }
                        label="As absolute values"
                        value={false}
                      />
                      <Tooltip
                        title={
                          <div className="text-center">
                            <div>
                              The current period’s value without relation to
                              previous data.
                            </div>
                            <br />
                            <div>
                              Example: If you sold 10 items on day 1 and 20
                              items on day 2, the absolute value for day 2 is 20
                              items.
                            </div>
                          </div>
                        }
                      >
                        <span className="text-[#7C7E7E] text-lg">
                          <HiMiniInformationCircle />
                        </span>
                      </Tooltip>
                    </div>
                    <div className="flex items-center w-[30%] min-w-[240px]">
                      <FormControlLabel
                        control={
                          <Radio
                            sx={{ "&.Mui-checked": { color: deepPurple[500] } }}
                          />
                        }
                        label="As cumulative values"
                        value={true}
                      />
                      <Tooltip
                        title={
                          <div className="text-center">
                            <div>
                              The running total of all the values up to the
                              current point and including the current period’s
                              value.
                            </div>
                            <br />
                            <div>
                              Example: If you sold 10 items on day 1 and 20
                              items on day 2, the cumulative value for day 2 is
                              30 items.
                            </div>
                          </div>
                        }
                      >
                        <span className="text-[#7C7E7E] text-lg">
                          <HiMiniInformationCircle />
                        </span>
                      </Tooltip>
                    </div>
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="w-24 h-10 mr-4 bg-white rounded border border-customYellow justify-center items-center gap-2 inline-flex text-zinc-700 text-sm font-medium hover:bg-gray-200"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button className="w-24 h-10 bg-customYellow rounded justify-center items-center gap-2 inline-flex text-sm font-medium hover:bg-yellow-600">
              Add KPI
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <ModalRightSide isOpen={isOpen} onRequestClose={onRequestClose} width="50%">
      {renderAddKpiModal()}
    </ModalRightSide>
  );
}
