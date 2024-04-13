// boolean.pipe.ts

import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class BooleanPipe implements PipeTransform {
  transform(value: any): boolean | Record<string, unknown> {
    // Convert string values to boolean
    if (typeof value === 'string') {
      return value === 'true'; // Adjust as needed based on your requirements
    }
    // if its an object map all its values to boolean
    if (typeof value === 'object') {
      return Object.keys(value).reduce<Record<string, boolean>>((acc, key) => {
        const _value = value[key];
        const _floatValue = parseFloat(_value);
        const isNumberValue = !isNaN(_floatValue) && isFinite(_floatValue);
        // if its a string check if string is true indeed
        if (typeof _value === 'string' && !isNumberValue) {
          acc[key] = _value === 'true';
          return acc;
        } else {
          acc[key] = _value;
        }
        return acc;
      }, {});
    }
    return Boolean(value); // Fallback to default boolean conversion
  }
}
