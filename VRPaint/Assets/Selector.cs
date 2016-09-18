using UnityEngine;
using System.Collections;

public class Selector : MonoBehaviour {
    neighborTarget currentTarget;
    SteamVR_TrackedController controller;
    bool useLine = false;
    LineRenderer lineRenderer;
    GameObject tranformObject;
    float lineDistance = 6f;
    // Use this for initialization
    void Start () {
        lineRenderer = GetComponent<LineRenderer>();
        if (Application.platform != RuntimePlatform.Android)
        {
            controller = GetComponent<SteamVR_TrackedController>();
            controller.TriggerClicked += onTrigger;
            tranformObject = gameObject;
        } else
        {
            tranformObject = Camera.main.gameObject;
        }

    }
	
	// Update is called once per frame
	void Update () {
        if (useLine)
        {
            lineRenderer.SetPosition(0, tranformObject.transform.position);
        }
        RaycastHit hit;
        if (Physics.Raycast(new Ray(tranformObject.transform.position, tranformObject.transform.forward), out hit))
        {
            if (hit.transform.gameObject.GetComponent<neighborTarget>() != null)
            {
                currentTarget = hit.transform.gameObject.GetComponent<neighborTarget>();
                currentTarget.onFocus();
                if (useLine)
                {
                    lineRenderer.SetPosition(1, hit.point);
                }
            }
            if (useLine)
            {
                lineRenderer.SetPosition(1, tranformObject.transform.position + tranformObject.transform.forward * lineDistance);
            }
        } else
        {
            if (currentTarget != null)
            {
                currentTarget.onLoseFocus();
                currentTarget = null;
            }
            if (useLine)
            {
                lineRenderer.SetPosition(1, tranformObject.transform.position + tranformObject.transform.forward * lineDistance);
            }
        }

        if (Input.GetMouseButtonDown(0))
        {
            onTrigger(null, new ClickedEventArgs());
        }
    }

    void onTrigger(object sender, ClickedEventArgs e)
    {
        if (currentTarget != null)
        {
            currentTarget.onClick();
        }
    }
}
