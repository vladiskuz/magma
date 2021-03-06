#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from functools import partial
from typing import Any, Callable, List, Mapping, Optional

from dataclasses_json import dataclass_json
from marshmallow import fields as marshmallow_fields

from .datetime_utils import fromisoformat


DATETIME_FIELD = field(
    metadata={
        "dataclasses_json": {
            "encoder": datetime.isoformat,
            "decoder": fromisoformat,
            "mm_field": marshmallow_fields.DateTime(format="iso"),
        }
    }
)


@dataclass_json
@dataclass
class AddEquipmentInput:
    @dataclass_json
    @dataclass
    class PropertyInput:
        propertyTypeID: str
        id: Optional[str] = None
        stringValue: Optional[str] = None
        intValue: Optional[int] = None
        booleanValue: Optional[bool] = None
        floatValue: Optional[float] = None
        latitudeValue: Optional[float] = None
        longitudeValue: Optional[float] = None
        rangeFromValue: Optional[float] = None
        rangeToValue: Optional[float] = None
        equipmentIDValue: Optional[str] = None
        locationIDValue: Optional[str] = None
        serviceIDValue: Optional[str] = None
        isEditable: Optional[bool] = None
        isInstanceProperty: Optional[bool] = None

    name: str
    type: str
    properties: List[PropertyInput]
    location: Optional[str] = None
    parent: Optional[str] = None
    positionDefinition: Optional[str] = None
    workOrder: Optional[str] = None
    externalId: Optional[str] = None


@dataclass_json
@dataclass
class AddEquipmentMutation:
    __QUERY__ = """
    mutation AddEquipmentMutation($input: AddEquipmentInput!) {
  addEquipment(input: $input) {
    id
    name
  }
}

    """

    @dataclass_json
    @dataclass
    class AddEquipmentMutationData:
        @dataclass_json
        @dataclass
        class Equipment:
            id: str
            name: str

        addEquipment: Optional[Equipment] = None

    data: Optional[AddEquipmentMutationData] = None
    errors: Optional[Any] = None

    @classmethod
    # fmt: off
    def execute(cls, client, input: AddEquipmentInput):
        # fmt: off
        variables = {"input": input}
        response_text = client.call(cls.__QUERY__, variables=variables)
        return cls.from_json(response_text).data
