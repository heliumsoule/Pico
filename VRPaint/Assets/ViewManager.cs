using UnityEngine;
using System.Collections.Generic;
using System.Collections;

public class ViewManager : MonoBehaviour {
    public TextureFetcher textureFetcher;
    public TextFetcher textfetcher;
    public string startURL;
    public List<Neighbor> neighbors;
    public List<GameObject> neighborTargets;
    public GameObject neighborTargetPrefab;
    public GameObject markerRoot;
	// Use this for initialization
	void Start () {
        textureFetcher.fetch(startURL);
        fetchNeighborURLs(startURL);
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void fetchNeighborURLs(string url)
    {
        textfetcher.fetch(url, (List<Neighbor> n) => {
            neighbors = n;
            int neighborIdx = 0;
            foreach(Neighbor neighbor in neighbors)
            {
                //setup new neighbors;
                textureFetcher.preFetch(neighbor.url);
                if (neighborIdx < neighborTargets.Count)
                {
                    neighborTargets[neighborIdx].GetComponent<neighborTarget>().neighbor = neighbor;
                    neighborTargets[neighborIdx].transform.localEulerAngles = new Vector3(0, neighbor.degreesRotated, 0);
                    neighborTargets[neighborIdx].SetActive(true);
                } else
                {
                    GameObject newNeighbor = Instantiate(neighborTargetPrefab, Vector3.zero, Quaternion.identity) as GameObject;
                    newNeighbor.transform.parent = markerRoot.transform;
                    newNeighbor.GetComponent<neighborTarget>().neighbor = neighbor;
                    newNeighbor.GetComponent<neighborTarget>().viewManager = this;
                    newNeighbor.transform.localEulerAngles = new Vector3(0, neighbor.degreesRotated, 0 );
                    newNeighbor.transform.localPosition = Vector3.zero;
                    neighborTargets.Add(newNeighbor);
                }
                neighborIdx++;
            }
        });
    }

    public void gotoNeighbor(Neighbor neighbor)
    {
        foreach(GameObject obj in neighborTargets)
        {
            obj.SetActive(false);
        }
        textureFetcher.fetch(neighbor.url);
        fetchNeighborURLs(neighbor.url);

    }
}
