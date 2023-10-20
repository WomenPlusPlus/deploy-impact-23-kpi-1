import { useState } from "react";
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
import { KpiExtended } from "../model/kpi";

export default function AddKpiModalPage({
  isOpen,
  onRequestClose,
  circleId,
  fetchKpiDefinitions,
  kpiDefinitions,
  setKpiDefinitions,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  circleId: number;
  fetchKpiDefinitions: () => Promise<void>;
  kpiDefinitions: KpiExtended[];
  setKpiDefinitions: React.Dispatch<React.SetStateAction<KpiExtended[]>>;
}): JSX.Element {
  const [kpiName, setKpiName] = useState("");
  const [description, setDescription] = useState("");
  const [periodicityValue, setPeriodicityValue] = useState("daily");
  const [unitValue, setUnitValue] = useState("numeric");
  const [formulaValue, setFormulaValue] = useState("aggregate");
  const [cumulativeValue, setCumulativeValue] = useState(false);

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
        console.log("check data add kpi to circle", data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const addKpiToHistory = async (kpiId: number) => {
    try {
      const { data, error } = await supabase
        .from("kpi_values_history")
        .insert([
          {
            circle_id: circleId,
            kpi_id: kpiId,
            value: 0,
            period_date: new Date(),
            action: "CREATE",
            periodicity: periodicityValue,
          },
        ])
        .select("*");

      if (error) {
        console.log("Error adding new KPI to history:", error.message);
      }
      if (data) {
        console.log("check data add kpi to history", data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setKpiName("");
    setDescription("");
    setPeriodicityValue("daily");
    setUnitValue("numeric");
    setFormulaValue("aggregate");
    setCumulativeValue(false);
    onRequestClose();
  };

  const handleAddKpi = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("kpi_definition")
        .insert([
          {
            kpi_name: kpiName,
            description: description ? description : null,
            periodicity: periodicityValue,
            unit: unitValue,
            active: false,
            cumulative: cumulativeValue,
            formula: formulaValue,
          },
        ])
        .select("*");

      if (error) {
        console.log("Error adding new KPI:", error.message);
      }
      if (data) {
        console.log("check data add kpi", data);
        const newKpi = data[0];
        addKpiToCircle(newKpi.kpi_id);
        addKpiToHistory(newKpi.kpi_id);
        const updatedKpiDefinitions = [...kpiDefinitions, newKpi];
        setKpiDefinitions(updatedKpiDefinitions);
        await fetchKpiDefinitions();
        handleCloseModal();
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <ModalRightSide isOpen={isOpen} onRequestClose={onRequestClose}>
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
            placeholder="Write how your new KPI is called"
            value={kpiName}
            onChange={(e) => setKpiName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-start gap-2.5 pb-10 border-b border-[#D0D8DB]">
          <label htmlFor="description" className="text-base font-medium">
            Description
          </label>
          <input
            className="grow appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-[#ADBCF2] focus:border-2 rounded w-full"
            type="text"
            name="description"
            placeholder="Write how your new KPI is called"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="py-10 border-b border-[#D0D8DB]">
          <div className="text-2xl font-normal mb-4">
            Periodicity - How often do you track this KPI?
          </div>
          <div className="flex justify-center">
            <Box>
              <FormControl>
                <RadioGroup
                  value={periodicityValue}
                  name="periodicity-group"
                  onChange={(e) => setPeriodicityValue(e.target.value)}
                  row
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
          <div className="flex justify-center">
            <Box>
              <FormControl>
                <RadioGroup
                  value={unitValue}
                  name="unit-group"
                  onChange={(e) => setUnitValue(e.target.value)}
                  row
                  className="flex gap-16"
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
            Calculation - How is this KPI calculated?
          </div>
          <div className="text-sm my-3">
            You can check the additional informations to each selection if you
            are not sure which.
          </div>
          <div className="flex justify-center">
            <Box>
              <FormControl>
                <RadioGroup
                  value={formulaValue}
                  name="formula-group"
                  onChange={(e) => setFormulaValue(e.target.value)}
                  row
                  className="flex gap-16 items-center"
                >
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
                        With this selection you get the average of all the KPI
                        values for the period.
                      </div>
                    }
                  >
                    <span className="text-[#7C7E7E] text-lg">
                      <HiMiniInformationCircle />
                    </span>
                  </Tooltip>
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
                        With this selection you get the combined total of all
                        the KPI values for the period.
                      </div>
                    }
                  >
                    <span className="text-[#7C7E7E] text-lg">
                      <HiMiniInformationCircle />
                    </span>
                  </Tooltip>
                </RadioGroup>
              </FormControl>
            </Box>
          </div>
        </div>
        <div className="py-10 border-b border-[#D0D8DB]">
          <div className="text-2xl font-normal mb-4">
            Value type-How should all the future values be stored?
          </div>
          <div className="flex justify-center">
            <Box>
              <FormControl>
                <RadioGroup
                  value={cumulativeValue}
                  name="cumulative-group"
                  onChange={(e) =>
                    setCumulativeValue(e.target.value === "true")
                  }
                  row
                  className="flex gap-8 items-center"
                >
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
                          With this selection you get the exact or specific
                          value without relation to previous data.
                        </div>
                        <br />
                        <div>
                          Example: If you sold 10 items on day 1 and 20 items on
                          day 2, the absolute value for day 2 is 20 items.
                        </div>
                      </div>
                    }
                  >
                    <span className="text-[#7C7E7E] text-lg">
                      <HiMiniInformationCircle />
                    </span>
                  </Tooltip>
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
                          With this selection you will get the running total of
                          all the values up to the current point and including
                          this periods current value.
                        </div>
                        <br />
                        <div>
                          Example: If you sold 10 items on day 1 and 20 items on
                          day 2, the cumulative value for day 2 is 30 items.
                        </div>
                      </div>
                    }
                  >
                    <span className="text-[#7C7E7E] text-lg">
                      <HiMiniInformationCircle />
                    </span>
                  </Tooltip>
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
    </ModalRightSide>
  );
}
