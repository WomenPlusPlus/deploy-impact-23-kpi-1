type ListProps<T> = {
  data: T[];
  onClick: (value: T) => void;
  renderItem: (item: T) => React.ReactNode;
};

export const GenericList = <T extends {}>({
  data,
  onClick,
  renderItem,
}: ListProps<T>) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} onClick={() => onClick(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};
