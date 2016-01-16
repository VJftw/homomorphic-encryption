<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Computation
 *
 * @ORM\Table(
 *      indexes={
 *          @ORM\Index(name="idx_computation_hashid", columns={"hashid"})
 *      }
 * )
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ComputationRepository")
 */
class Computation
{

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="hashid", type="string", length=10)
     */
    private $hashId;

    /**
     * @var string
     *
     * @ORM\Column(name="scheme", type="string", length=255)
     */
    private $scheme;

    /**
     * @var string
     *
     * @ORM\Column(name="operation", type="string", length=1)
     */
    private $operation;

    /**
     * @var integer
     *
     * @ORM\Column(name="a_encrypted", type="text")
     */
    private $aEncrypted;

    /**
     * @var integer
     *
     * @ORM\Column(name="b_encrypted", type="text")
     */
    private $bEncrypted;

    /**
     * @var array
     *
     * @ORM\Column(name="public_key", type="json_array")
     */
    private $publicKey;

    /**
     * @var array
     *
     * @ORM\Column(name="stages", type="json_array")
     */
    private $stages;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="timestamp", type="datetime")
     */
    private $timestamp;

    /**
     * @var String
     *
     * @ORM\Column(name="ip_address", type="string", length=15)
     */
    private $ipAddress;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param $hashId
     *
     * @return $this
     */
    public function setHashId($hashId)
    {
        $this->hashId = $hashId;

        return $this;
    }

    /**
     * @return string
     */
    public function getHashId()
    {
        return $this->hashId;
    }

    /**
     * @param $scheme
     *
     * @return $this
     */
    public function setScheme($scheme)
    {
        $this->scheme = $scheme;

        return $this;
    }

    /**
     * @return string
     */
    public function getScheme()
    {
        return $this->scheme;
    }

    /**
     * @param $operation
     *
     * @return $this
     */
    public function setOperation($operation)
    {
        $this->operation = $operation;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getOperation()
    {
        return $this->operation;
    }

    /**
     * @param int $aEncrypted
     *
     * @return $this
     */
    public function setAEncrypted($aEncrypted)
    {
        $this->aEncrypted = $aEncrypted;

        return $this;
    }

    /**
     * @return int
     */
    public function getAEncrypted()
    {
        return $this->aEncrypted;
    }

    /**
     * @param int $bEncrypted
     *
     * @return $this
     */
    public function setBEncrypted($bEncrypted)
    {
        $this->bEncrypted = $bEncrypted;

        return $this;
    }

    /**
     * @return int
     */
    public function getBEncrypted()
    {
        return $this->bEncrypted;
    }

    /**
     * @param string $publicKey
     *
     * @return $this
     */
    public function setPublicKey($publicKey)
    {
        $this->publicKey = $publicKey;

        return $this;
    }

    /**
     * @return string
     */
    public function getPublicKey()
    {
        return $this->publicKey;
    }

    /**
     * @param $stages
     *
     * @return $this
     */
    public function setStages($stages)
    {
        $this->stages = $stages;

        return $this;
    }

    /**
     * @return array
     */
    public function getStages()
    {
        return $this->stages;
    }

    /**
     * Set timestamp
     *
     * @param \DateTime $timestamp
     *
     * @return Computation
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @param $ipAddress
     *
     * @return $this
     */
    public function setIpAddress($ipAddress)
    {
        $this->ipAddress = $ipAddress;

        return $this;
    }

    /**
     * @return String
     */
    public function getIpAddress()
    {
        return $this->ipAddress;
    }
}

