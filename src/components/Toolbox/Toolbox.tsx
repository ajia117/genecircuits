import React, {useState} from 'react';
import CreatableSelect from "react-select/creatable";
import NodeData from "../../types/NodeData";
import '../../index.css';

interface ToolboxProps {
    labels: string[];
    getLabelData: (label: string) => NodeData;
}

interface OptionType {
    readonly label: string;
    value: string | number;
}

export const Toolbox: React.FC<ToolboxProps> = ({
        labels,
        getLabelData
     }) => {

    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [isNewLabel, setIsNewLabel] = useState(false);
    const genericNodeData: NodeData = {
        label: null,
        initialConcentration: 1,
        hillCoefficient: 1,
        lossRate: 1,
        beta: 1,
        delay: 0,
        inputs: 1,
        outputs: 1
    };
    const [nodeData, setNodeData] = useState<NodeData>(genericNodeData);

    const createOption = (label: string): OptionType => ({
        label,
        value: label
    });
    const [labelOptions, setLabelOptions] = useState<OptionType[]>(
        labels.map(createOption)
    );

    const handleInputChange = (key: string, value: string | number) => {
        setNodeData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCreate = (inputValue: string) => {
        // return if option already exists without trailing/leading whitespace
        const option = labelOptions.find(option => option.label === inputValue.trim());
        if(option) {
            setSelectedOption(option);
            return;
        }

        // add new option to list of labels
        const newOption = createOption(inputValue);
        setLabelOptions([...labelOptions, newOption]);
        setSelectedOption(newOption);
        setIsNewLabel(true);
        setNodeData({
            ...genericNodeData,
            label: inputValue
        });
    };

    // don't always allow the create string option to appear
    const isValidCreateString = (inputValue: string) => {
        return inputValue !== "" && !labelOptions.find(option => option.label === inputValue.trim());
    }

    // this is for changing to an already existing label
    const handleChange = (inputValue: OptionType | null) => {
        setSelectedOption(inputValue);

        if(!inputValue) {
            // Reset form when cleared
            setNodeData(genericNodeData);
            setIsNewLabel(false);
            return;
        }
        const data = getLabelData(inputValue.label);

        // if someone made a label, but never dropped a node, still allow them to change its values
        // getLabelData only returns data if a node was dropped
        if(!data) {
            setSelectedOption(inputValue);
            setIsNewLabel(true);
            setNodeData({
                ...genericNodeData,
                label: inputValue.label
            });
        }
        else {
            setIsNewLabel(false);
            setNodeData({
                ...data,
                label: inputValue.label
            });
        }

    };

    // start dragging node, calls to onDrop in CircuitBuilderFlow when done
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        // store type, should always be "custom", "and", or "or"
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/node-data", JSON.stringify(nodeData));
        if(nodeType === "custom") {
            event.dataTransfer.setData("application/node-in", String(nodeData.inputs));
            event.dataTransfer.setData("application/node-out", String(nodeData.outputs));
        }
        event.dataTransfer.effectAllowed = "move";
    };

    // generate HTML for form
    const getLabelForm = () => {
        // make sure that if a node is dropped, you cannot edit the data anymore
        const dropped = getLabelData(selectedOption.label);

        return Object.entries(nodeData).map(([key, value]) => {
            if(key === 'label') return;
            if(key === 'inputs' || key === 'outputs') {
                return (
                    <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br/>
                    <input
                        name={key}
                        type="number"
                        min = {0}
                        max = {4}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, Number(e.target.value))}
                    /><br/>
                </div>
            )}
            const isReadOnly = (!!dropped || !isNewLabel);
            return (
                <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br/>
                    <input
                        readOnly={isReadOnly}
                        name={key}
                        type="range"
                        min={0}
                        max={1}
                        step={.01}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, isReadOnly ? value as number : Number(e.target.value))}
                        style={{ cursor: isReadOnly ? "not-allowed" : "grab"}}
                    />
                    <input
                        readOnly={isReadOnly}
                        name={key}
                        type="number"
                        min={0}
                        max={1}
                        step={.01}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, Number(e.target.value))}
                        style={{ cursor: isReadOnly ? "not-allowed" : ""}}
                    /><br/>
                </div>
            )
        });
    }

    return (
        <>
            <h1 className={`text-center`}>Toolbox</h1>
            <div className="components-container">
                <div className="dndnode and" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    AND Node
                </div>
                <div className="dndnode or" onDragStart={(event) => onDragStart(event, 'or')} draggable>
                OR Node
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded shadow-sm">
                    <h3 className="text-lg font-medium mb-3">Choose existing Protein or Create New</h3>
                    <div className="space-y-3">
                        <CreatableSelect
                            isClearable
                            onChange={handleChange}
                            onCreateOption={handleCreate}
                            options={labelOptions}
                            value={selectedOption}
                            isValidNewOption={isValidCreateString}
                            formatCreateLabel={(inputValue) => `Create "${inputValue.trim()}"`}
                        />

                        {selectedOption && getLabelForm()}
                    </div>
                    <br/>
                    {selectedOption &&
                        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
                            Drag Node
                        </div>
                    }
                </div>

            </div>
        </>
    );
};

export default Toolbox;
