import Barcode from "react-barcode";

export default function Modal({ handleModal, barcode }) {
  //   console.log(barcode);
  return (
    <div
      data-dialog-backdrop="modal"
      //   data-dialog-backdrop-close="true"
      className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-4 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        data-dialog="modal"
        className="relative w-full max-w-xl min-w-0 rounded-lg bg-white p-4 shadow-sm modal-body"
      >
        <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
          Barcode
        </div>
        <div className="relative w-full min-w-0 overflow-hidden border-t border-slate-200 py-4 leading-normal text-slate-600 font-light [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full">
          <Barcode value={barcode} width={1} height={90} />
        </div>
        <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
          {/* <button
            data-dialog-close="true"
            className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Cancel
          </button> */}
          <button
            data-dialog-close="true"
            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
            onClick={handleModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
