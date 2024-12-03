/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import startCase from "lodash-es/startCase";
import React, { FunctionComponent, ReactElement } from "react";
import { Element } from "../../models/elements";

/**
 * Props interface of {@link CommonComponentPropertyFactory}
 */
export interface CommonComponentPropertyFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The element associated with the property.
     */
    element: Element;
    /**
     * The key of the property.
     */
    propertyKey: string;
    /**
     * The value of the property.
     */
    propertyValue: any;
}

/**
 * Factory to generate the common property configurator for the given component.
 *
 * @param props - Props injected to the component.
 * @returns The CommonComponentPropertyFactory component.
 */
const CommonComponentPropertyFactory: FunctionComponent<CommonComponentPropertyFactoryPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-component-property-factory",
    element,
    propertyKey,
    propertyValue
}: CommonComponentPropertyFactoryPropsInterface): ReactElement | null => {
    if (typeof propertyValue === "boolean") {
        return (
            <FormControlLabel
                control={ <Checkbox checked={ propertyValue } /> }
                label={ startCase(propertyKey) }
                data-componentid={ `${ componentId }-${propertyKey}` }
            />
        );
    }

    if (typeof propertyValue === "string") {
        return (
            <TextField
                fullWidth
                label={ startCase(propertyKey) }
                value={ propertyValue }
                data-componentid={ `${ componentId }-${propertyKey}` }
            />
        );
    }

    return null;
};

export default CommonComponentPropertyFactory;
