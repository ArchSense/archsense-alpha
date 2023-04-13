export const defaultComment = `
/**
 * 
 * Hello, stranger!!
 * Welcome to ArchSense
 * 
 * I'm your navigator around the architecture
 * You can see the existing API surface and main building blocks.
 * 
 * How does it work?
 * 
 * We scanned, analyzed your code and sprinkled some magic over you code 
 * to show how it actually looks like.
 * 
 * | APIs                |     Architecture        |   Source code             |
 * |---------------------|-------------------------|---------------------------|
 * | here you will see   | here you see the        | click on any block        |
 * | the existing API    | overall architecture    | on the diagram and here   |
 * |                     |                         | you see the source code   |
 * |---------------------|-------------------------|---------------------------|
 * 
 * 
 */
`;

export const generateNewClass = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return `
  class ${capitalizedName} {
    constructor() {
      // I am your new service
    }
  }
  `;
};
