using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class RemoveTriangle : MonoBehaviour
{
    public SteamVR_TrackedController rightController;
    bool triggerClicked;
    bool useCamera = false;
    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        if (Application.platform == RuntimePlatform.Android)
        {

        }
        else
        {
            //Steam VR
            if (useCamera)
            {
                makeCast();
            } else if (rightController.triggerPressed)
            {
                makeCast();
            }
        }

    }
    
    public void onTriggerDown()
    {
        triggerClicked = true;
    }

    public void onTriggerUp()
    {
        triggerClicked = false;
    }

    public void makeCast()
    {
        //RaycastHit hit;
        GameObject root = useCamera ? Camera.main.gameObject : rightController.gameObject;
        Vector3 newOrigin = root.transform.position + root.transform.forward * 600f;
       // GetComponent<Collider>().Raycast(new Ray(newOrigin, -1 * rightController.transform.forward), out hit, float.MaxValue);
        RaycastHit[] hits = Physics.SphereCastAll(new Ray(newOrigin, -1 * root.transform.forward), 30f, float.MaxValue);
        List<int> removedTraingleIndex = new List<int>();


        foreach (RaycastHit hit in hits)
        {
            if (hit.collider != null && hit.triangleIndex != -1 && !removedTraingleIndex.Contains(hit.triangleIndex))
            {
                removedTraingleIndex.Add(hit.triangleIndex);
            }
        }
        removedTraingleIndex.Sort();
        int offset = 0;
        foreach(int triangleIdx in removedTraingleIndex)
        {
            var mesh = gameObject.GetComponent<MeshFilter>().mesh;
            int[] triangles = mesh.triangles;
            triangles = removeTriangle(triangleIdx - offset, triangles);
            mesh.triangles = triangles;
            GetComponent<MeshCollider>().sharedMesh = mesh;
            offset ++;
        }

    }


    private int[] removeTriangle(int triangle, int[] tris)
    {
        for (var i = triangle * 3; i < tris.Length - 3; ++i)
        {
            if (tris[i] == -1) break;
            tris[i] = tris[i + 3];
        }
        return tris;
    }

}
