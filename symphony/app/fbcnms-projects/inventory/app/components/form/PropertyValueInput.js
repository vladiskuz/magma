/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FocusEvent} from '@fbcnms/ui/components/design-system/Input/TextInput';
import type {Property} from '../../common/Property';
import type {PropertyType} from '../../common/PropertyType';
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import EnumPropertySelectValueInput from './EnumPropertySelectValueInput';
import EnumPropertyValueInput from './EnumPropertyValueInput';
import EquipmentTypeahead from '../typeahead/EquipmentTypeahead';
import FormField from '@fbcnms/ui/components/design-system/FormField/FormField';
import FormValidationContext from '@fbcnms/ui/components/design-system/Form/FormValidationContext';
import GPSPropertyValueInput from './GPSPropertyValueInput';
import LocationTypeahead from '../typeahead/LocationTypeahead';
import RangePropertyValueInput from './RangePropertyValueInput';
import Select from '@fbcnms/ui/components/design-system/Select/Select';
import ServiceTypeahead from '../typeahead/ServiceTypeahead';
import Text from '@fbcnms/ui/components/design-system/Text';
import TextInput from '@fbcnms/ui/components/design-system/Input/TextInput';
import classNames from 'classnames';
import update from 'immutability-helper';
import {getPropertyValue} from '../../common/Property';
import {withStyles} from '@material-ui/core/styles';

type Props = {
  autoFocus: boolean,
  className: string,
  inputClassName?: ?string,
  label: ?string,
  inputType: 'Property' | 'PropertyType',
  property: Property | PropertyType,
  required: boolean,
  disabled: boolean,
  onChange: (Property | PropertyType) => void,
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void,
  onKeyDown?: ?(e: SyntheticKeyboardEvent<>) => void,
  margin: 'none' | 'dense' | 'normal',
  headlineVariant?: 'headline' | 'form',
  fullWidth?: boolean,
} & WithStyles<typeof styles>;

const styles = {
  input: {
    width: (props: Props): string => (props.fullWidth ? 'auto' : '300px'),
    display: 'flex',
    '&&': {
      margin: '0px',
    },
  },
  container: {
    display: 'flex',
    width: '280px',
  },
  toValue: {
    marginLeft: '6px',
  },
  selectMenu: {
    height: '32px',
    padding: '6px 8px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
  },
};

class PropertyValueInput extends React.Component<Props> {
  static defaultProps = {
    required: false,
    autoFocus: false,
    disabled: false,
    headlineVariant: 'headline',
    fullWidth: false,
  };

  getTextInput = (showDisabled): React.Node => {
    const {
      autoFocus,
      classes,
      onChange,
      onBlur,
      margin,
      required,
      className,
      inputClassName,
      onKeyDown,
      inputType,
      headlineVariant,
    } = this.props;
    const disabled = this.props.disabled || showDisabled;
    const property = this.props.property;
    const propertyType = !!property.propertyType
      ? property.propertyType
      : property;
    const label = headlineVariant === 'form' ? null : this.props.label;
    const propInputType = propertyType.type;
    switch (propInputType) {
      case 'enum': {
        return inputType == 'Property' ? (
          <EnumPropertySelectValueInput
            className={classNames(classes.input, className)}
            property={property}
            onChange={onChange}
            disabled={disabled}
          />
        ) : (
          <EnumPropertyValueInput
            property={property}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }
      case 'date':
      case 'datetime_local':
      case 'email':
      case 'string':
        const coercedInputType:
          | 'date'
          | 'datetime_local'
          | 'email'
          | 'string' = propInputType;
        return (
          <TextInput
            autoFocus={autoFocus}
            required={required}
            disabled={disabled}
            id="property-value"
            label={label}
            variant="outlined"
            className={classNames(classes.input, className)}
            margin={margin}
            value={property.stringValue ?? ''}
            onBlur={e => onBlur && onBlur(e)}
            onKeyDown={e => onKeyDown && onKeyDown(e)}
            onChange={event =>
              onChange(
                update(property, {
                  stringValue: {$set: event.target.value},
                }),
              )
            }
            inputProps={{className: inputClassName}}
            // as we cant use hypens on server side types,
            // replacing with underscores
            // e.g. datetime_local -> datetime-local.
            type={coercedInputType.replace('_', '-')}
          />
        );
      case 'int':
        return (
          <TextInput
            autoFocus={autoFocus}
            required={required}
            disabled={disabled}
            id="property-value"
            label={label}
            variant="outlined"
            className={classNames(classes.input, className)}
            margin={margin}
            placeholder={'0'}
            {...(property.intValue ? {value: property.intValue} : {})}
            onBlur={e => onBlur && onBlur(e)}
            onKeyDown={e => onKeyDown && onKeyDown(e)}
            onChange={event =>
              onChange(
                update(property, {
                  intValue: {$set: parseInt(event.target.value)},
                }),
              )
            }
            inputProps={{className: inputClassName}}
            type="number"
          />
        );
      case 'float':
        return (
          <TextInput
            autoFocus={autoFocus}
            required={required}
            disabled={disabled}
            id="property-value"
            label={label}
            variant="outlined"
            className={classNames(classes.input, className)}
            margin={margin}
            value={property.floatValue ?? 0}
            onBlur={e => onBlur && onBlur(e)}
            onKeyDown={e => onKeyDown && onKeyDown(e)}
            onChange={event =>
              onChange(
                update(property, {
                  floatValue: {$set: parseFloat(event.target.value)},
                }),
              )
            }
            inputProps={{className: inputClassName}}
            type="number"
          />
        );
      case 'gps_location':
        return (
          <GPSPropertyValueInput
            required={required}
            disabled={disabled}
            id="property-value"
            label={this.props.label}
            className={classNames(classes.input, className)}
            margin={margin}
            value={{
              latitude: property.latitudeValue,
              longitude: property.longitudeValue,
            }}
            onLatitudeChange={event =>
              onChange(
                update(property, {
                  latitudeValue: {$set: parseFloat(event.target.value)},
                }),
              )
            }
            onLongitudeChange={event =>
              onChange(
                update(property, {
                  longitudeValue: {$set: parseFloat(event.target.value)},
                }),
              )
            }
          />
        );
      case 'bool':
        return (
          <Select
            id="property-value"
            className={classNames(classes.input, className)}
            label={label}
            disabled={disabled}
            selectedValue={property.booleanValue}
            onChange={value =>
              onChange(
                update(property, {
                  booleanValue: {
                    $set: value,
                  },
                }),
              )
            }
            options={[
              {
                value: true,
                label: 'True',
              },
              {
                value: false,
                label: 'False',
              },
            ]}
          />
        );
      case 'range':
        return (
          <RangePropertyValueInput
            required={required}
            disabled={disabled}
            id="property-value"
            label={this.props.label}
            className={classNames(classes.input, className)}
            margin={margin}
            onBlur={e => onBlur && onBlur(e)}
            value={{
              rangeFrom: property.rangeFromValue,
              rangeTo: property.rangeToValue,
            }}
            onRangeFromChange={event =>
              onChange(
                update(property, {
                  rangeFromValue: {$set: parseFloat(event.target.value)},
                }),
              )
            }
            onRangeToChange={event =>
              onChange(
                update(property, {
                  rangeToValue: {$set: parseFloat(event.target.value)},
                }),
              )
            }
          />
        );
      case 'equipment':
        return inputType == 'Property' ? (
          <EquipmentTypeahead
            margin="dense"
            // eslint-disable-next-line no-warning-comments
            // $FlowFixMe - need to fix this entire file as it receives either property or property type
            selectedEquipment={property.equipmentValue}
            onEquipmentSelection={equipment =>
              onChange(
                update(property, {
                  equipmentValue: {$set: equipment},
                }),
              )
            }
            headline={label}
          />
        ) : (
          <Text>-</Text>
        );
      case 'location':
        return inputType == 'Property' ? (
          <LocationTypeahead
            margin="dense"
            // eslint-disable-next-line no-warning-comments
            // $FlowFixMe - need to fix this entire file as it receives either property or property type
            selectedLocation={property.locationValue}
            onLocationSelection={location =>
              onChange(
                update(property, {
                  locationValue: {$set: location},
                }),
              )
            }
            headline={label}
          />
        ) : (
          <Text>-</Text>
        );
      case 'service':
        return inputType == 'Property' ? (
          <ServiceTypeahead
            margin="dense"
            // eslint-disable-next-line no-warning-comments
            // $FlowFixMe - need to fix this entire file as it receives either property or property type
            selectedService={property.serviceValue}
            onServiceSelection={service =>
              onChange(
                update(property, {
                  serviceValue: {$set: service},
                }),
              )
            }
            headline={label}
          />
        ) : (
          <Text>-</Text>
        );
    }
    return null;
  };

  render() {
    return (
      <FormValidationContext.Consumer>
        {validationContext => {
          const input = this.getTextInput(validationContext.editLock.detected);

          const {property, headlineVariant, required} = this.props;
          const propertyType = !!property.propertyType
            ? property.propertyType
            : property;

          const propInputType = propertyType.type;
          if (
            headlineVariant !== 'form' ||
            propInputType === 'gps_location' ||
            propInputType === 'range'
          ) {
            return input;
          }
          const errorText = validationContext.error.check({
            fieldId: propertyType.name,
            fieldDisplayName: propertyType.name,
            value: getPropertyValue(property),
            required,
          });
          return (
            <FormField
              required={required}
              hasError={!!errorText}
              errorText={errorText}
              label={propertyType.name}>
              {input}
            </FormField>
          );
        }}
      </FormValidationContext.Consumer>
    );
  }
}

// eslint-disable-next-line no-warning-comments
// $FlowFixMe - styling based on props works, but flow doesn't recognize it.
export default withStyles(styles)(PropertyValueInput);
