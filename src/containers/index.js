import React, { Component } from 'react'
import { Text, View , StyleSheet, TextInput, Button, ScrollView, TouchableOpacity} from 'react-native'
import firebase from '../config/firebase';
import CheckBox from 'react-native-check-box';
export class Depan extends Component {
    state ={
        rencana : '',
        listRencanaAktifitas: [],
        update: null
    }
    componentDidMount(){
       this.getDataRencana();
    }

    getDataRencana = () => {
        let rencana = firebase.database().ref('/listRencanaAktifitas');
        rencana.once('value').then(snapshot => {
            this.setState({
                listRencanaAktifitas : snapshot.val(),
            })
        })
    }

    tambahRencana = () => {
      const {rencana} = this.state;
      if(rencana === ''){
          alert('Silahkan Masukan Rencana Anda!');
          return false;
      }
      firebase
      .database()
      .ref('/listRencanaAktifitas')
      .push({
          aktivitas : this.state.rencana,
          sudah : false,
          tanggal : new Date().toString()
      })
      .then(() => {
        alert('SUkses Mesmasukan Aktivitas Rencana Baru!');
        this.getDataRencana()
        this.setState({
            rencana: ''
        })

      })
      .catch(error => {
          alert(error)
      })
    }
    klikRadio = (key) => {
        const {listRencanaAktifitas} = this.state;
        var sudah = listRencanaAktifitas[key].sudah;
        var aktivitas = listRencanaAktifitas[key].aktivitas;
        var sudahBaru = "";
        if(sudah){
            var sudahBaruVal =  "Belum Selesai";
            sudahBaru = false;
        }else{
            var sudahBaruVal = "Sudah Selesai";
            sudahBaru = true;
        }
        firebase
        .database()
        .ref('/listRencanaAktifitas/'+key)
        .set({
            aktivitas: aktivitas,
            sudah: sudahBaru,
            tanggal : new Date().toString()
        })
        .then(() => {
            this.getDataRencana()
        })
        .catch(err => {
            alert(err);
        })
        alert(aktivitas+" Sudah Diubah Statusnya Menjadi "+sudahBaruVal)

    }
    deleteRencanaFirebase = (id) => {
        firebase
        .database()
        .ref('/listRencanaAktifitas/'+id)
        .remove()
    }
    aktionDeleteRencana = () => {
        const {listRencanaAktifitas} = this.state;
        let keyFirebase = Object.keys(listRencanaAktifitas);
        let i=0;
        keyFirebase.map((key) => {
            if(listRencanaAktifitas[key].sudah){
                this.deleteRencanaFirebase(key);
                i++;
            }
        })
       if(i > 0){
           alert(i + " Telah dihapus");
       }else{
           alert("Tidak Ada Data Yang dihapus");
       }
       this.getDataRencana()
    }
    getUpdate = (aktivitas) => {
            this.setState({
                rencana :aktivitas,
                update: true
            })
    }
    aksiUpdateRencana = () => {
        alert('update')
    }
    cancelUpdate = () => {
        this.setState({
            rencana : '',
            update: null
        })
    }
    render() {
        let keyFirebase = [];
        const {listRencanaAktifitas} = this.state;
        if(listRencanaAktifitas){
            keyFirebase = Object.keys(listRencanaAktifitas);
        }
        return (
            <View style={styles.viewWrapper}>
                <View style={styles.viewAktivitas}>
                    <ScrollView scrollEnabled showsVerticalScrollIndicator stickyHeaderIndices> 
                    {
                        keyFirebase.map((key) => (
                            <TouchableOpacity key={key} onPress={() => this.getUpdate(listRencanaAktifitas[key].aktivitas)}>
                                <View style={styles.viewItem}>
                                    <View style={{marginLeft: 10}}>
                                    <Text>{listRencanaAktifitas[key].aktivitas}</Text>
                                    <Text  style={styles.textItem}>{listRencanaAktifitas[key].tanggal.substring(0, 24)}</Text>
                                    </View>
                                    <CheckBox style={styles.chkeckItem}
                                              checkBoxColor="skyblue"
                                              isChecked={listRencanaAktifitas[key].sudah}
                                              onClick={() => this.klikRadio(key)}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                    </ScrollView>
                </View>

                {
                    this.state.update ?
                    <>
                    <View style={styles.viewTombolUpdate}>
                        <TextInput style={styles.textInput} placeholder="Update Rencana AKtivitas" onChangeText={(text) => this.setState({rencana : text})} value={this.state.rencana}/>
                        <Button title="Update Rencana" color="green" onPress={this.aksiUpdateRencana} />
                    </View>
                        <View style={styles.viewTombolCancel}>
                        <Button title="Cancel" color="yellow" onPress={this.cancelUpdate} />
                    </View>
                    </>
                    :
                    <View style={styles.viewTombol}>
                    <TextInput style={styles.textInput} placeholder="Masukan Rencana AKtivitas" onChangeText={(text) => this.setState({rencana : text})} value={this.state.rencana}/>
                    <Button title="Tambah Rencana" onPress={this.tambahRencana} />
                </View>
                }

                <View style={styles.viewTombolDelete}>
                    <Button 
                        title="Hapus Rencana yang Selesai"
                        color="red"
                        onPress={this.aktionDeleteRencana}
                    />
                </View>
            </View>
        )
    }
}

export default Depan;
const styles = StyleSheet.create({
    viewWrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    viewAktivitas: {
        flex: 4,
    },
    viewTombol: {
        flex: 2,
        textAlign: 'center',
        justifyContent: 'center',
    },
    viewTombolDelete: {
        marginTop: 1,

    },
    textInput: {
        borderWidth: 1,
        borderColor: '#afafaf',
        borderRadius: 5,
        paddingHorizontal: 50,
        marginVertical: 20,
        fontSize: 20
    },
    textItem: {
        flex: 4,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        width: 200
    },
    viewItem: {
        flexDirection: 'row'
    },
    chkeckItem: {
        flex: 1,
        marginTop: 20,
        marginLeft: 140
    },
    viewTombolUpdate: {
        marginBottom: 4
    },
    viewTombolCancel: {
        marginBottom: 4,
    }
})
