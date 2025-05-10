import Button from "../Button";

const Widget = (props) => {
  const {
    title,
    count,
    status,
    description,
    showActionCard = false,
    actionButtonText = "Tambah Baru",
    actionDescription = "tambah item baru",
    onAction,
    actionTarget = "#offcanvasAdd",
    customClass = "",
    additionalContent,
    imageUrl,
  } = props;

  const renderInfoCard = () => (
    <div className={`bg-white rounded-lg shadow ${customClass}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h6 className="font-normal text-sm">
            <b>{status}</b> {title}
          </h6>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-xl font-semibold mb-1">{count}</h4>
            <span className="text-sm text-gray-600">
              {title.toLowerCase()} memiliki <b>{count}</b>{" "}
              {description.toLowerCase()}
            </span>
          </div>
        </div>
        {additionalContent && <div className="mt-3">{additionalContent}</div>}
      </div>
    </div>
  );

  const renderActionCard = () => (
    <div className={`bg-white rounded-lg shadow h-full ${customClass}`}>
      <div className="p-1 h-full flex flex-col sm:flex-row items-center justify-between">
        <div className="sm:w-5/12 mb-4 sm:mb-0">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Illustration"
              className="hidden sm:block max-w-full h-auto"
            />
          )}
        </div>
        <div className="sm:w-7/12">
          <div className="p-6 text-center sm:text-right sm:pl-0">
            <Button
              variant="primary"
              data-bs-target={actionTarget}
              data-bs-toggle="offcanvas"
              onClick={onAction}
            >
              {actionButtonText}
            </Button>
            <p className="text-sm text-gray-600 m-0">{actionDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return showActionCard ? renderActionCard() : renderInfoCard();
};

export default Widget;
