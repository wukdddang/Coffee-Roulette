const UserTableLoading = () => {
  return (
    <div className="tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
      <div className="tw-w-full tw-max-w-4xl tw-animate-pulse">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-bg-gray-300 tw-rounded-lg tw-mb-2">
          {/* ID, Name, Email에 해당하는 스켈레톤 블록 */}
          <div className="tw-col-span-4 tw-h-10 tw-bg-gray-300"></div>
          <div className="tw-col-span-4 tw-h-10 tw-bg-gray-300"></div>
          <div className="tw-col-span-4 tw-h-10 tw-bg-gray-300"></div>
        </div>
        {/* 여러 행에 걸친 스켈레톤 로딩 효과를 나타내기 위해 반복 */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="tw-grid tw-grid-cols-12 tw-gap-4 tw-last:border-0 tw-mb-2"
          >
            <div className="tw-col-span-4 tw-h-8 tw-bg-gray-300"></div>
            <div className="tw-col-span-4 tw-h-8 tw-bg-gray-300"></div>
            <div className="tw-col-span-4 tw-h-8 tw-bg-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTableLoading;
