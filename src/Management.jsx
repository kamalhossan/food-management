import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import Form from "./components/form";
import { supabase } from "./utils/supabase";

export default function Management() {
  const [workers, setWorkers] = useState([]);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [formData, setFormData] = useState({
    // id: "" // id is default
    name: "",
    serial_no: "",
    company: "",
  });

  useEffect(() => {
    async function fetchWorkers() {
      const { data, error } = await supabase.from("workers").select("*");

      if (error) {
        console.log("There was an error: ", error);
      } else {
        setWorkers(data);
      }
    }

    fetchWorkers();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.serial_no) {
      alert("দয়া করে অন্তত আইডি দিন");
      return;
    }

    // বারকোডের জন্য একটি ইউনিক স্ট্রিং তৈরি করছি (যেমন: Name-ID-Age)
    const uniqueString = `ID:${formData.serial_no}_Name:${formData.name}_Age:${formData.age}`;

    const newUser = {
      //   id: formData.id,
      name: formData.name,
      serial_no: formData.serial_no,
      company: formData.company,
      barcode: uniqueString,
    };

    const { data: createWorker, error } = await supabase
      .from("workers")
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.log("error creating workers: ", error);
    } else {
      setWorkers((prev) => [createWorker, ...prev]);
      setBarcodeValue(uniqueString);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Form
        handleGenerate={handleGenerate}
        handleChange={handleChange}
        formData={formData}
      />
      {barcodeValue && (
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            background: "#f4f4f4",
            padding: "20px",
          }}
        >
          <h3>জেনারেট হওয়া বারকোড:</h3>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              padding: "10px",
            }}
          >
            <Barcode value={barcodeValue} />
          </div>
          <p>
            <strong>ডাটা:</strong> {barcodeValue}
          </p>
        </div>
      )}
      <div className="flex flex-col">
        {workers.map((worker) => (
          <div key={worker.id} className="flex flex-row gap-3 justify-between">
            <span className="text-left">{worker.name}</span>
            <span>{worker.company}</span>
            <span>{worker.serial_no}</span>
            <span>{worker.barcode}</span>
          </div>
        ))}
      </div>
    </>
  );
}
