import { FileIdentifier, ParsedResult } from '@archsense/scout';

const isController = (file: ParsedResult) => file.name.endsWith('.controller');
const isResolver = (file: ParsedResult) => file.name.endsWith('.resolver');

interface ScenariosProps {
  serviceId?: string;
  components: { [key: FileIdentifier]: ParsedResult }
}

const Scenarios = ({ serviceId, components }: ScenariosProps) => {
  let controllers: ParsedResult[] = [];
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
        let members = exports[0].members ?? [];
        members = members.filter((member) => Boolean(member.method));
        members = members.sort((a: any, b: any) => a.method.localeCompare(b.method));

        return (
          <div key={idx}>
            <h5>{name}</h5>
            {members.map((member) => {
              const scenario = `${member.method} ${
                isResolver({ name } as any) ? member.name : member.apiPath
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
