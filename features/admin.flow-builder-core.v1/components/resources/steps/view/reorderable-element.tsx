/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Box, { BoxProps } from "@oxygen-ui/react/Box";
import { GetDragItemProps } from "@oxygen-ui/react/dnd";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useRef } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Element } from "../../../../models/elements";
import Handle from "../../../dnd/handle";
import Sortable, { SortableProps } from "../../../dnd/sortable";

/**
 * Props interface of {@link ReorderableElement}
 */
export interface ReorderableComponentPropsInterface
    extends IdentifiableComponentInterface,
        Omit<SortableProps, "element">,
        Omit<BoxProps, "children" | "id"> {
    /**
     * The element to be rendered.
     */
    element: Element;
    /**
     * Additional props needed for the draggable functionality.
     */
    draggableProps?: Partial<GetDragItemProps>;
}

/**
 * Re-orderable component inside a step node.
 *
 * @param props - Props injected to the component.
 * @returns ReorderableElement component.
 */
export const ReorderableElement: FunctionComponent<ReorderableComponentPropsInterface> = ({
    id,
    element,
    className,
    "data-componentid": componentId = "sortable-component",
    ...rest
}: ReorderableComponentPropsInterface): ReactElement => {
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const stepId: string = useNodeId();
    const { ElementFactory, setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();


    return (
        <Sortable
            id={ id }
            handleRef={ handleRef }
            data={ { isReordering: true, resource: element, stepId } }
            type={ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID }
            accept={ [
                VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID
            ] }
            { ...rest }
        >
            <Box
                display="flex"
                alignItems="center"
                className={ classNames("reorderable-component", className) }
                onClick={ event => {
                    event.stopPropagation();
                    setLastInteractedStepId(stepId);
                    setLastInteractedResource(element);
                } }
                data-componentid={ `${componentId}-${element.type}` }
            >
                <Handle ref={ handleRef } />
                <div className="flow-builder-step-content-form-field-content">
                    <ElementFactory stepId={ stepId } resource={ element } />
                </div>
            </Box>
        </Sortable>
    );
};

export default ReorderableElement;
