// boolean.pipe.ts

import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class BooleanPipe implements PipeTransform {
  transform(value: any): boolean | Record<string, boolean> {
    // Convert string values to boolean
    if (typeof value === 'string') {
      return value === 'true'; // Adjust as needed based on your requirements
    }
    // if its an object map all its values to boolean
    if (typeof value === 'object') {
      return Object.keys(value).reduce<Record<string, boolean>>((acc, key) => {
        // if its a string check if string is true indeed
        if (typeof value[key] === 'string') {
          acc[key] = value[key] === 'true';
          return acc;
        } else {
          acc[key] = Boolean(value[key]);
        }
        return acc;
      }, {});
    }
    return Boolean(value); // Fallback to default boolean conversion
  }
}
