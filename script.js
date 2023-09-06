let registers = [0, 0, 0, 0, 0, 0, 0, 0];

function decodeInstruction(instruction){
	return {
		opcode: parseInt(instruction.substr(0, 2), 2),
		reg1: parseInt(instruction.substr(2, 3), 2),
		reg2: parseInt(instruction.substr(5, 3), 2),
		reg3: parseInt(instruction.substr(8, 3), 2),
		constant: parseInt(instruction.substr(11, 5), 2)
	};
}

function executeAdd(decodedInstruction) {
	registers[decodedInstruction.reg3] = registers[decodedInstruction.reg1] + registers[decodedInstruction.reg2];
}

function executeSubtract(decodedInstruction) {
    registers[decodedInstruction.reg3] = registers[decodedInstruction.reg2] - registers[decodedInstruction.reg1];
}

function executeAddWithConstant(decodedInstruction) {
    registers[decodedInstruction.reg3] = registers[decodedInstruction.reg1] + decodedInstruction.constant;
}

function executeSubtractWithConstant(decodedInstruction) {
    registers[decodedInstruction.reg3] = registers[decodedInstruction.reg1] - decodedInstruction.constant;
}

function executeInstruction(instruction) {
    let decoded = decodeInstruction(instruction);

    switch(decoded.opcode) {
        case 0:
            executeAdd(decoded);
            break;
        case 1:
            executeSubtract(decoded);
            break;
        case 2:
            executeAddWithConstant(decoded);
            break;
        case 3:
            executeSubtractWithConstant(decoded);
            break;
    }

    updateDisplay();
}

function updateDisplay() {
    let registerDisplays = document.querySelectorAll(".register_display");
    registerDisplays.forEach((display, index) => {
        display.textContent = registers[index];
    });
}

function highlightCurrentInstruction() {
    let textarea = document.getElementById("instructionEditor");
    let instructions = textarea.value.split("\n");

    let start = 0;
    for (let i = 0; i < currentInstructionIndex; i++) {
        start += instructions[i].length + 1; // +1 for the newline character
    }

    let end = start + instructions[currentInstructionIndex].length;

    textarea.setSelectionRange(start, end);
    textarea.focus(); // This will actually show the selection
}

function validateInstructions(instructions) {
    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i].trim(); // Remove any spaces
        if (instruction.length !== 16 || !/^[01]+$/.test(instruction)) {
            return {
                valid: false,
                index: i,
                instruction: instruction
            };
        }
    }
    return {
        valid: true
    };
}

document.getElementById("nextInstruction").addEventListener("click", function() {
    let instructions = document.getElementById("instructionEditor").value.split("\n");

    let validationResult = validateInstructions(instructions);
    if (!validationResult.valid) {
        alert("Error in instruction at line " + (validationResult.index + 1) + ": " + validationResult.instruction);
        return; // Stop here and don't proceed to execution
    }

    if (currentInstructionIndex < instructions.length) {
        executeInstruction(instructions[currentInstructionIndex]);
        highlightCurrentInstruction();
        currentInstructionIndex++;
    }
});


document.getElementById("Reset").addEventListener("click", function() {
    resetRegisters();
    currentInstructionIndex = 0;
    updateDisplay();
});

function resetRegisters() {
    registers = [0, 0, 0, 0, 0, 0, 0, 0];
}