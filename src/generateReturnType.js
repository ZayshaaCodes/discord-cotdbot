const fs = require('fs');

function generateReturnType(jsonData, newTypename) {
    // Generate class fields
    let classFields = '';
    let constructorParams = '';
    let constructorDocParams = '';

    for (const key in jsonData) {
        const fieldType = Array.isArray(jsonData[key]) ? 'Array' : typeof jsonData[key];

        // Add JSDoc comments for constructor parameters
        constructorDocParams += `   * @param {${fieldType}} data.${key}\n`;

        // Generate constructor parameters with default values
        constructorParams += `${key} = ${fieldType === 'object' ? '{}' : 'null'}, `;

        // Generate class fields assignment
        classFields += `    this.${key} = ${key};\n`;
    }

    // Remove the last comma and space from constructor parameters
    constructorParams = constructorParams.slice(0, -2);

    // Create the class definition with JSDoc comments
    const classDefinition = `
  /**
   * ${newTypename} class.
   */
  class ${newTypename} {
    /**
     * Create a new instance of ${newTypename}.
     *
  ${constructorDocParams}   */
    constructor(${constructorParams}) {
  ${classFields}  }
  
    /**
     * Deserialize JSON data into a new instance of ${newTypename}.
     *
     * @param {string} jsonData - The JSON data to deserialize.
     * @returns {${newTypename}} - A new instance of ${newTypename}.
     */
    static fromJSON(jsonData) {
      const data = JSON.parse(jsonData);
      return new ${newTypename}(data);
    }
  }
  
  module.exports = ${newTypename};
  `;

    return classDefinition;
}

module.exports = generateReturnType;