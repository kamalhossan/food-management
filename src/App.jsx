import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import Form from "./components/form";
import Modal from "./components/Modal";
import { supabase } from "./utils/supabase";

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [formData, setFormData] = useState({
    // id: "" // id is default
    name: "",
    serial_no: "",
    company: "",
  });

  const [modal, setModal] = useState(false);
  const [modalBarcode, setModalBarcode] = useState("");

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

  // const handleModal = () => {
  //   console.log("click");
  //   setModal((m) => {
  //     !m;
  //   });
  // };

  const handleModal = () => setModal((isOpen) => !isOpen);

  console.log(workers);

  const handleView = (barcode) => {
    setModalBarcode(barcode);
    setModal((isOpen) => !isOpen);
  };

  return (
    <main className="container mx-auto">
      <div className="body-content block">
        <Form
          handleGenerate={handleGenerate}
          handleChange={handleChange}
          barcodeValue={barcodeValue}
          formData={formData}
        />
        <div className="flex flex-col">
          <div className="table-header flex flex-row justify-between text-left mb-5">
            <div>Worker Id</div>
            <div>Worker Name</div>
            <div>Worker Company</div>
            <div>Worker Serial No</div>
            <div>Worker Barcode</div>
          </div>
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="flex flex-row gap-3 justify-between"
            >
              <span className="text-left">{worker.id}</span>
              <span className="text-left">{worker.name}</span>
              <span>{worker.company}</span>
              <span>{worker.serial_no}</span>
              {/* <span>{worker.barcode}</span> */}
              <div>
                <button
                  // barcode={worker.barcode}
                  className="p-1"
                  onClick={() => handleView(worker.barcode)}
                >
                  View Barcode
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
      {modal ? <Modal handleModal={handleModal} barcode={modalBarcode} /> : ""}
    </main>
  );
}
