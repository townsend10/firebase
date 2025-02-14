interface PageInterface {
  name: string;
  age: number;
}

export const Page = ({ age, name }: PageInterface) => {
  return <div>nome:{name}</div>;
};

const PageFather = () => {
  return (
    <div>
      <Page age={2} name="george" />
    </div>
  );
};
