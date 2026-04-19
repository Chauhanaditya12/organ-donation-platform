// Import Web3 JS library
const Web3 = require('web3');

// Import the ABI definition of the DonorContract
const artifact = require('../../build/contracts/DonorContract.json');

const MIN_GAS = 3000000;

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function selectRow() {
    var table = document.getElementById('pending-table');
    if (!table) return;
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.onclick = function () {
            var rowId = this.parentNode.rowIndex;
            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].style.fontWeight = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.style.backgroundColor = "#aad7ec";
            rowSelected.style.fontWeight = 800;
            rowSelected.className += " selected";

            var row_value = [];
            for (var i= 0; i < rowSelected.cells.length; i++) {
                row_value[i] = rowSelected.cells[i].innerHTML;
            }
            
            document.getElementById("getPledgeFullName").innerHTML =  row_value[1];
            document.getElementById("getPledgeAge").innerHTML =  row_value[2];
            document.getElementById("getPledgeGender").innerHTML = row_value[3];
            document.getElementById("getPledgeMedicalID").innerHTML = row_value[4];
            document.getElementById("getPledgeBloodType").innerHTML =  row_value[5];
            document.getElementById("getPledgeOrgan").innerHTML = row_value[6];
            document.getElementById("getPledgeWeight").innerHTML =  row_value[7];
            document.getElementById("getPledgeHeight").innerHTML =  row_value[8];
            
            var textcontainer = document.getElementById("text-hidden");
            if (textcontainer) {
                textcontainer.style.display = "block";
                textcontainer.className = 'search-card verification';
            }
        }
    }
}

function showWarning(user, message, color) {
    let userid = user + "InputCheck";
    var warning = document.querySelector(".alert.warning");
    if (warning) {
        warning.style.background = color;
        const msgEl = document.getElementById(userid);
        if (msgEl) msgEl.innerHTML = message;
        warning.style.opacity = "100";
        warning.style.display = "block";
    }
}

function showSuccess(user, message, color) {
    let userid = user + "ConfirmationCheck";
    var successAlert = document.getElementById(userid);
    if (successAlert) {
        successAlert.innerHTML = message;
        var alertDiv = successAlert.closest(".alert.success");
        if (alertDiv) {
            alertDiv.style.background = color;
            alertDiv.style.opacity = "100";
            alertDiv.style.display = "block";
            setTimeout(function() { alertDiv.style.display = "none"; }, 5000);
        }
    }
}

function checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height) {
    var color = "#ff9800";
    if (fullname == "") showWarning(user, "Enter your name", color);
    else if (age.length == 0) showWarning(user, "Enter your age", color);
    else if (user == "Pledge" && age < 18) showWarning(user, "You must be over 18 to pledge", color);
    else if (gender == null) showWarning(user, "Enter your gender", color);
    else if (medical_id.length == 0) showWarning(user, "Enter your Medical ID", color);
    else if (organ.length == 0) showWarning(user, "Enter organ(s)", color);
    else if (weight.length == 0) showWarning(user, "Enter your weight", color);
    else if (weight < 20 || weight > 200) showWarning(user, "Enter proper weight", color);
    else if (height.length == 0) showWarning(user, "Enter your height", color);
    else if (height < 54 || height > 272) showWarning(user, "Enter proper height", color);
    else return true;
    return false;
}

function assignSearchValues(result, user) {
    document.getElementById("get"+user+"FullName").innerHTML = "Full Name: " + result[0];
    document.getElementById("get"+user+"Age").innerHTML = "Age: " + result[1];
    document.getElementById("get"+user+"Gender").innerHTML = "Gender: " + result[2];
    document.getElementById("get"+user+"BloodType").innerHTML = "Blood Type: " + result[3];
    document.getElementById("get"+user+"Organ").innerHTML = "Organ: " + result[4];
    document.getElementById("get"+user+"Weight").innerHTML = "Weight: " + result[5];
    document.getElementById("get"+user+"Height").innerHTML = "Height: " + result[6];
}

function clearSearchValues(user) {
    document.getElementById("get"+user+"FullName").innerHTML = null;
    document.getElementById("get"+user+"Age").innerHTML = null;
    document.getElementById("get"+user+"Gender").innerHTML = null;
    document.getElementById("get"+user+"BloodType").innerHTML = null;
    document.getElementById("get"+user+"Organ").innerHTML = null;
    document.getElementById("get"+user+"Weight").innerHTML = null;
    document.getElementById("get"+user+"Height").innerHTML = null;
}

const App = {
    web3: null,
    contractInstance: null,
    accounts: null,

    start: async function() {
        try {
            this.accounts = await this.web3.eth.getAccounts();
            const networkId = await this.web3.eth.net.getId();
            const deployedContract = artifact.networks[networkId];
            if (!deployedContract) {
                console.error("Contract not found on network:", networkId);
                return;
            }
            this.contractInstance = new this.web3.eth.Contract(artifact.abi, deployedContract.address);
            
            // Auto-load views based on current page
            if (document.getElementById("donor-table")) this.viewDonors();
            if (document.getElementById("patient-table")) this.viewPatients();
            if (document.getElementById("pledge-table")) this.viewPledges();
            if (document.getElementById("pending-table")) this.verifyPledges();
            if (document.getElementById("transplantTable")) this.transplantMatch();
        } catch (error) {
            console.error("Could not connect to contract or chain.", error);
        }
    },

    register: async function(user) {
        if (!App.contractInstance) return;
        const fullname = document.getElementById(user + 'FullName').value;
        const age = document.getElementById(user + 'Age').value;
        const selectedGender = document.querySelector("input[name='gender']:checked");
        const gender = (selectedGender) ? selectedGender.value : null;
        const medical_id = document.getElementById(user + 'MedicalID').value;
        const blood_type = document.getElementById(user + 'BloodType').value;
        let checkboxes = document.querySelectorAll("input[name='Organ']:checked");
        let organ = [];
        checkboxes.forEach((checkbox) => { organ.push(checkbox.value); });
        const weight = document.getElementById(user + 'Weight').value;
        const height = document.getElementById(user + 'Height').value;

        // Consent Check
        const consentCheckbox = document.getElementById(user + "Consent");
        if (consentCheckbox && !consentCheckbox.checked) {
            showWarning(user, "You must agree to the consent form", "#ff9800");
            return;
        }

        if (checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height)) {
            try {
                let validate;
                if (user == "Pledge") validate = await App.contractInstance.methods.validatePledge(medical_id).call();
                else if (user == "Donor") validate = await App.contractInstance.methods.validateDonor(medical_id).call();
                else if (user == "Patient") validate = await App.contractInstance.methods.validatePatient(medical_id).call();

                if (!validate) {
                    if (user == "Pledge") await App.setPledge(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                    else if (user == "Donor") await App.setDonor(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                    else if (user == "Patient") await App.setPatient(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                    showSuccess(user, "Registration Successful!", "#04AA6D");
                } else {
                    showWarning(user, "Medical ID already exists!", "#f44336");
                }
            } catch (error) {
                showWarning(user, "Blockchain Error: " + error.message, "#f44336");
            }
        }
    },

    setPledge: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await App.contractInstance.methods.setPledge(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({ from: App.accounts[0] });
        await App.contractInstance.methods.setPledge(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({ from: App.accounts[0], gas: Math.max(gas, MIN_GAS) });
    },

    setDonor: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await App.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({ from: App.accounts[0] });
        await App.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({ from: App.accounts[0], gas: Math.max(gas, MIN_GAS) });
    },

    setPatient: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await App.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({ from: App.accounts[0] });
        await App.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({ from: App.accounts[0], gas: Math.max(gas, MIN_GAS) });
    },

    viewDonors: async function() {
        const table = document.getElementById("donor-table");
        if (!table) return;
        const donorCount = await App.contractInstance.methods.getCountOfDonors().call();
        const donorIDs = await App.contractInstance.methods.getAllDonorIDs().call();
        
        for (let i = 0; i < donorCount; i++) {
            const result = await App.contractInstance.methods.getDonor(donorIDs[i]).call();
            const donor = [{ Index: i + 1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": donorIDs[i], "Blood Type": result[3], "Organ(s)": result[4].join(", "), "Weight": result[5], "Height": result[6] }];
            if (i == 0) generateTableHead(table, Object.keys(donor[0]));
            generateTable(table, donor);
        }
    },

    viewPatients: async function() {
        const table = document.getElementById("patient-table");
        if (!table) return;
        const patientCount = await App.contractInstance.methods.getCountOfPatients().call();
        const patientIDs = await App.contractInstance.methods.getAllPatientIDs().call();

        for (let i = 0; i < patientCount; i++) {
            const result = await App.contractInstance.methods.getPatient(patientIDs[i]).call();
            const patient = [{ Index: i + 1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": patientIDs[i], "Blood Type": result[3], "Organ(s)": result[4].join(", "), "Weight": result[5], "Height": result[6] }];
            if (i == 0) generateTableHead(table, Object.keys(patient[0]));
            generateTable(table, patient);
        }
    },

    viewPledges: async function() {
        const table = document.getElementById("pledge-table");
        if (!table) return;
        const pledgeCount = await App.contractInstance.methods.getCountOfPledges().call();
        const pledgeIDs = await App.contractInstance.methods.getAllPledgeIDs().call();

        for (let i = 0; i < pledgeCount; i++) {
            const result = await App.contractInstance.methods.getPledge(pledgeIDs[i]).call();
            const pledge = [{ Index: i + 1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": pledgeIDs[i], "Blood Type": result[3], "Organ(s)": result[4].join(", "), "Weight": result[5], "Height": result[6] }];
            if (i == 0) generateTableHead(table, Object.keys(pledge[0]));
            generateTable(table, pledge);
        }
    },

    verifyPledges: async function() {
        const table = document.getElementById("pending-table");
        if (!table) return;
        const pledgeCount = await App.contractInstance.methods.getCountOfPledges().call();
        const pledgeIDs = await App.contractInstance.methods.getAllPledgeIDs().call();
        let tableCreated = false;
        let initialHeader = true;

        for (let i = 0; i < pledgeCount; i++) {
            const isDonor = await App.contractInstance.methods.validateDonor(pledgeIDs[i]).call();
            if (!isDonor) {
                tableCreated = true;
                const result = await App.contractInstance.methods.getPledge(pledgeIDs[i]).call();
                const pledge = [{ Index: i + 1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": pledgeIDs[i], "Blood-Type": result[3], Organ: result[4].join(", "), Weight: result[5], Height: result[6] }];
                if (initialHeader) {
                    generateTableHead(table, Object.keys(pledge[0]));
                    initialHeader = false;
                }
                generateTable(table, pledge);
            }
        }
        if (tableCreated) selectRow();
        else document.getElementById("pending-table-message").innerHTML = "No pending pledges found!";
    },

    forwardPledge: async function() {
        const medical_id = document.getElementById('getPledgeMedicalID').innerHTML;
        const result = await App.contractInstance.methods.getPledge(medical_id).call();
        try {
            await App.setDonor(result[0], result[1], result[2], medical_id, result[3], result[4], result[5], result[6]);
            alert("Pledge verified and moved to Donors database!");
            location.reload();
        } catch (error) {
            alert("Error: " + error.message);
        }
    },

    search: async function(user) {
        const medical_id = document.getElementById("input"+user+"MedicalID").value;
        if (medical_id.length == 0) {
            document.getElementById("search"+user+"Check").innerHTML = "Enter Medical ID";
            clearSearchValues(user);
            return;
        }
        let validate = false;
        if (user == "Donor") validate = await App.contractInstance.methods.validateDonor(medical_id).call();
        else if (user == "Patient") validate = await App.contractInstance.methods.validatePatient(medical_id).call();

        if (validate) {
            const method = (user == "Donor") ? App.contractInstance.methods.getDonor(medical_id) : App.contractInstance.methods.getPatient(medical_id);
            const result = await method.call();
            document.getElementById("search"+user+"Check").innerHTML = null;
            assignSearchValues(result, user);
        } else {
            document.getElementById("search"+user+"Check").innerHTML = "Medical ID does not exist!";
            clearSearchValues(user);
        }
    },

    transplantMatch: async function() {
        const table = document.getElementById("transplantTable");
        if (!table) return;
        const patientCount = await App.contractInstance.methods.getCountOfPatients().call();
        const donorCount = await App.contractInstance.methods.getCountOfDonors().call();
        const patientIDs = await App.contractInstance.methods.getAllPatientIDs().call();
        const donorIDs = await App.contractInstance.methods.getAllDonorIDs().call();

        let donors = [];
        for (let i = 0; i < donorCount; i++) {
            const res = await App.contractInstance.methods.getDonor(donorIDs[i]).call();
            donors.push({ ID: donorIDs[i], name: res[0], bloodtype: res[3], organs: res[4] });
        }

        let initialHeader = true;
        for (let i = 0; i < patientCount; i++) {
            const pat = await App.contractInstance.methods.getPatient(patientIDs[i]).call();
            const patName = pat[0];
            const patBlood = pat[3];
            const patOrgans = pat[4];

            for (let pOrg of patOrgans) {
                for (let j = 0; j < donors.length; j++) {
                    let matched = false;
                    for (let dIdx = 0; dIdx < donors[j].organs.length; dIdx++) {
                        if (patBlood == donors[j].bloodtype && pOrg == donors[j].organs[dIdx]) {
                            const match = [{ "Patient Name": patName, "Patient Organ": pOrg, "Patient Medical ID": patientIDs[i], " ": "↔️", "Donor Medical ID": donors[j].ID, "Donor Organ": donors[j].organs[dIdx], "Donor Name": donors[j].name }];
                            if (initialHeader) {
                                generateTableHead(table, Object.keys(match[0]));
                                initialHeader = false;
                            }
                            generateTable(table, match);
                            donors[j].organs.splice(dIdx, 1);
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }
            }
        }
    }
};

window.App = App;

window.addEventListener("load", async function() {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    }
    await App.start();
});
