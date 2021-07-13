import React, {useState, useEffect} from 'react'
import {SnapshotTable} from '../components/SnapshotTable'
import {fetchStyleDetail} from '../apis/styles'
import {NavMenu} from '../components/NavMenu'
import {useHistory, useParams} from "react-router-dom";
import {fetchAllSnapshots} from '../apis/snapshots';
import Lottie from 'react-lottie';
import animationData from '../assets/loading.json'
import { confirmAlert } from 'react-confirm-alert';

export const StyleDetailPage = () => {
  const history = useHistory();
  const {id} = useParams();
  const [activeSnapshotId,
    setActiveSnapshotId] = useState("")
  const [styleDetai,
    setStyleDetail] = useState({})
  const [iconFile,
    setIconFile] = useState(null)
  const [iconURL,
    setIconURL] = useState(null)
  const [styleName,
    setStyleName] = useState(null)
  const [status,
    setStatus] = useState(true)
  const [snapshots,
    setSnapshots] = useState([])
  const [loading,
    setLoading] = useState(false)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    isStopped: !loading
  };

  
  const showDeleteAlert = () => {
    confirmAlert({
      overlayClassName: "darken",
      customUI: ({ onClose }) => {
        return (
          <div className="py-6 px-12 rounded-lg shadow-xl bg-white">
            <p className="font-bold text-xl text-center">Confirm Delete</p>
            <p className="font-thin text-sm mt-2 text-center">Please confirm that you are sure <br/> to delete snapshot <strong>{"Udnie"}</strong> </p>
            <div className="flex items-center justify-center mt-4">
              <button onClick={() => {
                onClose()
              }} className="bg-yellow-300 px-4 py-2 rounded-lg shadow-lg text-black text-base mx-2 font-medium">
                Delete
              </button>
              <button onClick={() => onClose()} className="bg-gray-800 px-4 py-2 rounded-lg shadow-lg text-white text-base mx-2 font-medium">Cancel</button>
            </div>
          </div>
        )
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchStyleDetail(id).then(data => {
      setStyleDetail(data)
      setIconURL(data.iconURL)
      setStyleName(data.styleName)
      setStatus(data.isActive)
      setActiveSnapshotId(activeSnapshotId)
    }).catch(err => {
      console.log(err)
    });
    fetchAllSnapshots(id).then(data => {
      setSnapshots(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex h-screen">
      <div
        className={loading
        ? "w-full flex items-center h-full absolute bg-white"
        : "w-full flex items-center h-full absolute bg-white hidden"}
        style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)"
      }}>
        <Lottie options={defaultOptions} height={100} width={100}/>
      </div>
      <div className="w-1/5">
        <NavMenu activePage="Style List"/>
      </div>
      <div className="w-3/5 pt-5">
        <div className="flex items-center mb-6">
          <img
            src="https://image.flaticon.com/icons/png/512/545/545680.png"
            onClick={() => history.push('/')}
            className="h-6 w-6 mr-5 cursor-pointer"/>
          <div className="text-2xl font-thin">Application's Style Detail</div>

        </div>
        <div className="font-medium text-xl mb-3">Basic Information</div>
        <div>
          <div className="flex">
            <div>
              <img className="rounded-lg shadow-2xl h-44" src={iconURL}></img>

              <div class="mt-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">Style Icon:</label>
                <button
                  className="text-grey-lighter font-bold py-1 px-3 mt-4 text-white rounded text-sm bg-blue-500 hover:bg-blue-700 ml-3">Browse</button>
              </div>
            </div>
            <div className="ml-5 w-1/3">
              <div class="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">Style Name</label>
                <input
                  value={styleName}
                  placeholder="Enter Style's Name"
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 w-52 px-4"
                  required="required"
                  type="text"
                  name="integration[shop_name]"
                  id="integration_shop_name"/>
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
              <div className="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">Status</label>
                <select
                  value={status}
                  className="w-full border border-gray-300 rounded-lg text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                  <option value={true}>Active</option>
                  <option value={false}>Deactive</option>
                </select>
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
              <div class="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">Active snapshot</label>
                <select
                  value={activeSnapshotId}
                  className="w-full border border-gray-300 rounded-lg text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                  <option disabled={true} value="">Select active snapshot</option>
                  {snapshots.map(snapshot => {
                    return <option value={snapshot.id}>{snapshot.name}</option>
                  })
}
                </select>
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
            </div>
          </div>
          <button
            className="text-grey-lighter font-bold py-2 px-3 mt-4 text-white rounded text-sm bg-green-500 hover:bg-green-700 shadow-lg w-1/4">Save</button>
        </div>

        <div className="font-medium text-xl mb-3 mt-10">Style's Snapshot List</div>
        <div className="my-4 flex justify-end">
          <button
            onClick={() => history.push(`/styles/${id}/upload-snapshot`)}
            className="text-grey-lighter font-bold py-2 px-3 text-white rounded text-sm bg-blue-400 hover:bg-blue-600 shadow">Upload New Snapshot</button>
        </div>
        <SnapshotTable snapshots={snapshots}/>
      </div>
    </div>
  );
}