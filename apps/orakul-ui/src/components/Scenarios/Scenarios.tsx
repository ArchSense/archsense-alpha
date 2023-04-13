const isController = (file) => file.name.endsWith('.controller');
const isResolver = (file) => file.name.endsWith('.resolver');

const Scenarios = ({ serviceId, components }) => {
  let controllers: any = [];
  if (serviceId && components) {
    controllers = [
      ...Object.values(components).filter(isController),
      ...Object.values(components).filter(isResolver),
    ];
    controllers.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      <h4>APIs</h4>
      {controllers.map(({ name, exports }, idx) => {
        let members: any[] = exports[0].members;
        members = members.filter((member) => Boolean(member.method));
        members = members.sort((a, b) => a.method.localeCompare(b.method));

        return (
          <div key={idx}>
            <h5>{name}</h5>
            {members.map((member) => {
              const scenario = `${member.method} ${
                isResolver({ name }) ? member.name : member.apiPath
              }`;
              return (
                <div key={scenario} className="ScenarioSelector">
                  <span>{scenario}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
export default Scenarios;
